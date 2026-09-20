import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const backtestQueue = new Queue('BacktestQueue', { connection });

// Ensure we have scenarios defined
async function ensureScenarios() {
  const count = await prisma.privateScenario.count();
  if (count === 0) {
    const defaultScenarios = [
      { name: 'Scenario 1 (Mean Reversion)', datasetFile: 'mean_reversion', regimeType: 'MeanReversion', seed: 1001, weight: 0.2 },
      { name: 'Scenario 2 (Momentum)', datasetFile: 'momentum', regimeType: 'Momentum', seed: 2002, weight: 0.2 },
      { name: 'Scenario 3 (High Volatility)', datasetFile: 'high_volatility', regimeType: 'Volatile', seed: 3003, weight: 0.2 },
      { name: 'Scenario 4 (Liquidity Shock)', datasetFile: 'liquidity_shock', regimeType: 'Shock', seed: 4004, weight: 0.2 },
      { name: 'Scenario 5 (Mixed Regime)', datasetFile: 'mixed_regime', regimeType: 'Mixed', seed: 5005, weight: 0.2 },
    ];
    for (const sc of defaultScenarios) {
      await prisma.privateScenario.create({ data: sc });
    }
  }
  return await prisma.privateScenario.findMany();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin only.' }, { status: 401 });
    }

    const scenarios = await ensureScenarios();
    
    // Find all users
    const users = await prisma.user.findMany({
      where: { role: 'CANDIDATE' }
    });
    
    let evaluationCount = 0;
    
    for (const user of users) {
      // Find their LAST VALID SUBMISSION
      const lastValidSubmission = await prisma.submission.findFirst({
        where: {
          userId: user.id,
          jobs: {
            some: {
              status: 'COMPLETED'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (!lastValidSubmission) continue;
      
      // Create FinalEvaluation wrapper
      const finalEval = await prisma.finalEvaluation.create({
        data: {
          userId: user.id,
          submissionId: lastValidSubmission.id,
          publicScore: 0.0, // Should be fetched from leaderboard logic, stub for now
          status: 'PENDING'
        }
      });
      
      // Enqueue a job for each scenario
      for (const scenario of scenarios) {
        const run = await prisma.evaluationRun.create({
          data: {
            finalEvaluationId: finalEval.id,
            scenarioId: scenario.id,
            status: 'QUEUED'
          }
        });
        
        const queueJob = await backtestQueue.add('final_evaluation', {
          runId: run.id,
          submissionId: lastValidSubmission.id,
          strategyCode: lastValidSubmission.sourceCode,
          scenarioType: scenario.datasetFile, // mean_reversion, etc
          seed: scenario.seed,
          symbol: 'PRIVATE_ASSET'
        }, {
          jobId: `eval_${run.id}`
        });
        
        await prisma.evaluationRun.update({
          where: { id: run.id },
          data: { jobId: queueJob.id }
        });
      }
      
      evaluationCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Started final evaluation for ${evaluationCount} candidates.`
    });

  } catch (error: any) {
    console.error('Final evaluation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
