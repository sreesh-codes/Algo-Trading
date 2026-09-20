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
        submissionId: submission.id,
        dataset: dataset || 'DESERT_HYDROGEN',
        symbol: symbol || 'DESERT_HYDROGEN',
        status: 'QUEUED',
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
