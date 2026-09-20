import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });

const worker = new Worker(
  'BacktestQueue',
  async (job: Job) => {
    console.log(`[Worker] Picked up job ${job.id} of name ${job.name}`);
    
    if (job.name === 'final_evaluation') {
      return handleFinalEvaluation(job);
    }
    
    // Legacy / Public backtest logic
    const { submissionId, strategyCode, dataset, symbol } = job.data;
    
    // 1. Create a temporary file for the strategy
    const tempDir = path.join(process.cwd(), 'engine', 'sandbox', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const strategyPath = path.join(tempDir, `strategy_${job.id}.py`);
    fs.writeFileSync(strategyPath, strategyCode);
    
    const isEvaluation = job.data.isEvaluation || false;
    const datasetFolder = isEvaluation ? 'public/evaluation' : 'public/development';
    const datasetPath = path.join(process.cwd(), 'engine', 'datasets', datasetFolder, `${dataset}.csv`);
    
    return new Promise((resolve, reject) => {
      // Execute the docker container for security
      const child = spawn('/usr/local/bin/docker', [
        'run',
        '--rm',
        '--network', 'none', // Prevent external network access
        '--memory', '256m', // Limit memory
        '-v', `${strategyPath}:/competition/strategy.py:ro`,
        '-v', `${datasetPath}:/competition/dataset.csv:ro`,
        'algo-trading-sandbox',
        '/competition/strategy.py',
        '/competition/dataset.csv',
        symbol
      ]);
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', async (code) => {
        // Clean up temporary strategy file
        if (fs.existsSync(strategyPath)) fs.unlinkSync(strategyPath);
        
        if (code !== 0) {
            console.error(`[Worker] Job ${job.id} failed. Error:`, errorOutput);
            try {
                const parsed = JSON.parse(output.trim().split('\n').pop() || '{}');
                reject(new Error(parsed.error || 'Unknown execution error'));
            } catch (e) {
                reject(new Error('Engine crashed unexpectedly: ' + errorOutput));
            }
            return;
        }
        
        try {
            const lines = output.trim().split('\n');
            const jsonStr = lines[lines.length - 1];
            const result = JSON.parse(jsonStr);
            
            await prisma.backtestResult.create({
                data: {
                    jobId: job.id as string,
                    totalPnl: result.total_pnl,
                    realizedPnl: result.realized_pnl,
                    unrealizedPnl: result.unrealized_pnl,
                    maxDrawdown: result.max_drawdown,
                    tradeCount: result.trade_count,
                    statistics: JSON.stringify(result),
                    equityCurve: JSON.stringify(result.equity_curve),
                    finalPositions: JSON.stringify(result.final_positions),
                    engineVersion: "1.0.0",
                    datasetVersion: "1.0.0",
                    configurationHash: "default",
                    runtime: result.runtime_ms
                }
            });
            
            await prisma.backtestJob.update({
                where: { id: job.id },
                data: { status: 'COMPLETED', completedAt: new Date() }
            });
            
            resolve(result);
            
        } catch (err) {
            console.error(`[Worker] Failed to parse JSON or save result for job ${job.id}`, err);
            reject(new Error('Failed to parse engine output'));
        }
      });
    });
  },
  { connection }
);

async function handleFinalEvaluation(job: Job) {
  const { runId, submissionId, strategyCode, scenarioType, seed, symbol } = job.data;
  
  const tempDir = path.join(process.cwd(), 'engine', 'sandbox', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const strategyPath = path.join(tempDir, `strategy_eval_${runId}.py`);
  const datasetPath = path.join(tempDir, `dataset_eval_${runId}.csv`);
  
  fs.writeFileSync(strategyPath, strategyCode);
  
  await prisma.evaluationRun.update({
    where: { id: runId },
    data: { status: 'RUNNING' }
  });

  return new Promise((resolve, reject) => {
    // 1. Generate Dataset
    const genProcess = spawn('python', [
      'engine/datasets/generator.py',
      '--seed', seed.toString(),
      '--scenario', scenarioType,
      '--output', datasetPath,
      '--symbol', symbol
    ], { cwd: process.cwd() });
    
    genProcess.on('close', (gen_code) => {
      if (gen_code !== 0) {
        reject(new Error("Failed to generate private dataset"));
        return;
      }
      
      // 2. Run Sandbox
      const child = spawn('/usr/local/bin/docker', [
        'run', '--rm', '--network', 'none', '--memory', '256m',
        '-v', `${strategyPath}:/competition/strategy.py:ro`,
        '-v', `${datasetPath}:/competition/dataset.csv:ro`,
        'algo-trading-sandbox',
        '/competition/strategy.py',
        '/competition/dataset.csv',
        symbol
      ]);
      
      let output = '';
      
      child.stdout.on('data', (data) => { output += data.toString(); });
      
      child.on('close', async (code) => {
        // ALWAYS clean up the private dataset immediately
        if (fs.existsSync(strategyPath)) fs.unlinkSync(strategyPath);
        if (fs.existsSync(datasetPath)) fs.unlinkSync(datasetPath);
        
        if (code !== 0) {
            reject(new Error('Sandbox execution failed'));
            return;
        }
        
        try {
            const lines = output.trim().split('\n');
            const result = JSON.parse(lines[lines.length - 1]);
            
            await prisma.evaluationRun.update({
              where: { id: runId },
              data: {
                pnl: result.total_pnl,
                maxDrawdown: result.max_drawdown,
                tradeCount: result.trade_count,
                status: 'COMPLETED'
              }
            });
            
            resolve(result);
            
            // Check if final evaluation is completely done
            checkFinalEvaluationCompletion(runId);
            
        } catch (err) {
            reject(new Error('Failed to parse output'));
        }
      });
    });
  });
}

async function checkFinalEvaluationCompletion(runId: string) {
  // Wait a small moment to avoid race conditions
  await new Promise(r => setTimeout(r, 1000));
  
  const run = await prisma.evaluationRun.findUnique({
    where: { id: runId },
    include: { finalEvaluation: { include: { runs: { include: { scenario: true } } } } }
  });
  
  if (!run) return;
  const finalEval = run.finalEvaluation;
  
  const allDone = finalEval.runs.every((r: any) => r.status === 'COMPLETED' || r.status === 'FAILED');
  
  if (allDone && finalEval.status !== 'COMPLETED') {
    let finalScore = 0;
    
    for (const r of finalEval.runs) {
      if (r.status === 'COMPLETED' && r.pnl) {
        finalScore += r.pnl * r.scenario.weight;
      }
    }
    
    await prisma.finalEvaluation.update({
      where: { id: finalEval.id },
      data: {
        finalScore: finalScore,
        privateScore: finalScore,
        status: 'COMPLETED'
      }
    });
    console.log(`[Worker] Final evaluation ${finalEval.id} completed with score: ${finalScore}`);
  }
}

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

worker.on('failed', async (job, err) => {
  console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
  if (job?.id) {
    try {
        if (job.name === 'final_evaluation') {
            await prisma.evaluationRun.update({
                where: { id: job.data.runId },
                data: { status: 'FAILED' }
            });
            checkFinalEvaluationCompletion(job.data.runId);
        } else {
            await prisma.backtestJob.update({
                where: { id: job.id },
                data: { status: 'FAILED', error: err.message, completedAt: new Date() }
            });
        }
    } catch (e) {
        console.error("Failed to update job status to FAILED in DB");
    }
  }
});

console.log('[Worker] Listening for Backtest jobs...');
