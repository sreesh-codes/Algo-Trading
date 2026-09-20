import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const connection = new IORedis('redis://localhost:6379');
const backtestQueue = new Queue('BacktestQueue', { connection });
const prisma = new PrismaClient();

const strategy1 = `from participant_runtime.strategy_interface import Strategy

class MyStrategy(Strategy):
    def on_tick(self, market):
        if len(market.bids) > 0:
            self.buy(market.symbol, market.bids[0][0], 1)
`;

const strategy2 = `from participant_runtime.strategy_interface import Strategy

class MyStrategy(Strategy):
    def on_tick(self, market):
        if len(market.asks) > 0:
            self.sell(market.symbol, market.asks[0][0], 1)
`;

function hashString(str: string) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

async function run() {
    let user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");
    
    // Clean up previous jobs to be clean
    await prisma.backtestJob.deleteMany({});
    
    // Create Submission 1
    const sub1 = await prisma.submission.create({
        data: { userId: user.id, sourceCode: strategy1, sourceHash: hashString(strategy1) }
    });
    const job1 = await prisma.backtestJob.create({
        data: { submissionId: sub1.id, dataset: 'DUNE_ENERGY', symbol: 'DUNE_ENERGY' }
    });
    
    // Create Submission 2
    const sub2 = await prisma.submission.create({
        data: { userId: user.id, sourceCode: strategy2, sourceHash: hashString(strategy2) }
    });
    const job2 = await prisma.backtestJob.create({
        data: { submissionId: sub2.id, dataset: 'DUNE_ENERGY', symbol: 'DUNE_ENERGY' }
    });

    console.log("Adding job 1 to queue...");
    await backtestQueue.add('run_backtest', { submissionId: sub1.id, strategyCode: strategy1, dataset: 'DUNE_ENERGY', symbol: 'DUNE_ENERGY', isEvaluation: false }, { jobId: job1.id });
    
    await new Promise(r => setTimeout(r, 10000));
    
    console.log("Adding job 2 to queue...");
    await backtestQueue.add('run_backtest', { submissionId: sub2.id, strategyCode: strategy2, dataset: 'DUNE_ENERGY', symbol: 'DUNE_ENERGY', isEvaluation: false }, { jobId: job2.id });

    console.log("Waiting for worker...");
    await new Promise(r => setTimeout(r, 15000));

    console.log("Waiting for worker...");
    await new Promise(r => setTimeout(r, 10000));

    const res1 = await prisma.backtestResult.findUnique({ where: { jobId: job1.id } });
    const res2 = await prisma.backtestResult.findUnique({ where: { jobId: job2.id } });

    console.log("Strategy 1 (Buy):", res1 ? "PnL=" + res1.totalPnl + ", Trades=" + res1.tradeCount : "Failed");
    console.log("Strategy 2 (Sell):", res2 ? "PnL=" + res2.totalPnl + ", Trades=" + res2.tradeCount : "Failed");
    
    process.exit(0);
}
run();
