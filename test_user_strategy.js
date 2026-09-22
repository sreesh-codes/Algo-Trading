const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
async function main() {
  const jobs = await prisma.backtestJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { submission: true }
  });
  if (jobs.length > 0) {
    fs.writeFileSync('/tmp/sandbox-test/user_strategy.py', jobs[0].submission.sourceCode);
    console.log("Written strategy to /tmp/sandbox-test/user_strategy.py");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
