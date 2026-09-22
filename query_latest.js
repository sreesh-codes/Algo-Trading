const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const jobs = await prisma.backtestJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { submission: true, result: true }
  });
  if (jobs.length > 0) {
    console.log("Status:", jobs[0].status);
    console.log("Dataset:", jobs[0].dataset);
    console.log("Symbol:", jobs[0].symbol);
    console.log("Error:", jobs[0].error);
    console.log("Result:", jobs[0].result);
  } else {
    console.log("No jobs found");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
