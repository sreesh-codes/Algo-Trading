const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const jobs = await prisma.backtestJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { result: true }
  });
  if (jobs.length > 0 && jobs[0].result) {
    const rawResult = jobs[0].result.rawResult;
    console.log(rawResult.equityCurve.slice(0, 2));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
