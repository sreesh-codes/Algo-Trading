import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the job and ensure it belongs to the current user
    const job = await prisma.backtestJob.findUnique({
      where: { id },
      include: {
        submission: true,
        result: true
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.submission.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse the JSON string fields if the job is completed
    let parsedResult = null;
    if (job.result) {
      parsedResult = {
        totalPnl: job.result.totalPnl,
        realizedPnl: job.result.realizedPnl,
        unrealizedPnl: job.result.unrealizedPnl,
        maxDrawdown: job.result.maxDrawdown,
        tradeCount: job.result.tradeCount,
        runtime: job.result.runtime,
        equityCurve: JSON.parse(job.result.equityCurve),
        finalPositions: JSON.parse(job.result.finalPositions),
        statistics: JSON.parse(job.result.statistics),
      };
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      dataset: job.dataset,
      symbol: job.symbol,
      result: parsedResult
    });

  } catch (error: any) {
    console.error('Fetch job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
