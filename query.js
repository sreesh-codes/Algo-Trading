const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const job = await prisma.backtestJob.findUnique({
    where: { id: "cmub9yxsg00077sn13d6c38yd" },
    include: { submission: true }
  });
  console.log(job.submission.sourceCode);
}
main().catch(console.error).finally(() => prisma.$disconnect());
