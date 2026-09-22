import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import crypto from 'crypto';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const backtestQueue = new Queue('BacktestQueue', { connection });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sourceCode, dataset, symbol } = body;

    if (!sourceCode) {
      return NextResponse.json({ error: 'Missing sourceCode' }, { status: 400 });
    }

    // Generate SHA256 hash of the strategy
    const sourceHash = crypto.createHash('sha256').update(sourceCode).digest('hex');

    // 1. Create the submission
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        sourceCode,
        sourceHash,
      }
    });

    // 2. Create the BacktestJob
    const job = await prisma.backtestJob.create({
      data: {
        status: 'QUEUED',
        dataset: dataset || 'NEXUS_AI',
        symbol: symbol || 'NEXUS_AI',
        submissionId: submission.id,
      }
    });

    // 3. Add to BullMQ
    const queueJob = await backtestQueue.add('run_backtest', {
      submissionId: submission.id,
      strategyCode: sourceCode,
      dataset: job.dataset,
      symbol: job.symbol
    }, {
      jobId: job.id // Enforce the same ID for easy tracking
    });

    // 4. Update the DB with the actual BullMQ Job ID
    await prisma.backtestJob.update({
      where: { id: job.id },
      data: { queueJobId: queueJob.id }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: 'QUEUED'
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: { userId: session.user.id },
      include: {
        jobs: {
          include: {
            result: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedHistory = submissions.map((sub, index) => {
      const job = sub.jobs[0];
      const result = job?.result;
      const status = job?.status === 'COMPLETED' ? 'ACTIVE' : job?.status === 'FAILED' ? 'FAILED' : 'EVALUATING';
      
      const date = new Date(sub.createdAt);
      const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate()
      ).padStart(2, "0")} — ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} GST`;

      let rawResultObj = null;
      if (result && result.equityCurve) {
        try {
          rawResultObj = {
            ...result,
            equityCurve: JSON.parse(result.equityCurve)
          };
        } catch (e) {
          rawResultObj = result;
        }
      } else if (result) {
        rawResultObj = result;
      }

      return {
        version: `v${index + 1}`,
        submissionId: job?.id || sub.id,
        submittedAt: formattedDate,
        relativeTime: "Just now",
        roundNumber: 2,
        roundName: "The Arbitrage",
        filename: "my_strategy.py",
        status: status,
        backtestPnl: result ? result.realizedPnl + result.unrealizedPnl : 0,
        competitionScore: result ? Math.max(0, 100 - (result.maxDrawdown / 100)) : 0,
        sharpeRatio: result ? result.sharpeRatio : 0,
        maxDrawdown: result ? result.maxDrawdown : 0,
        executionLatencyMs: result ? result.runtime : 0,
        commitHash: (job?.id || sub.id).substring((job?.id || sub.id).length - 7),
        auditSummary: result ? `Exchange container executed successfully. Generated ${result.tradeCount} trades.` : `Execution status: ${job?.status}`,
        rawResult: rawResultObj
      };
    });

    // Mark all but the latest COMPLETED one as SUPERSEDED
    let foundActive = false;
    for (let i = formattedHistory.length - 1; i >= 0; i--) {
      if (formattedHistory[i].status === 'ACTIVE') {
        if (!foundActive) {
          foundActive = true;
        } else {
          formattedHistory[i].status = 'SUPERSEDED';
        }
      }
    }

    return NextResponse.json(formattedHistory.reverse());
  } catch (error: any) {
    console.error('Fetch history error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
