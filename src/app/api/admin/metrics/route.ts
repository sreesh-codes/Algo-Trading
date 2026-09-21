import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    const [
      teamsCount,
      submissionsCount,
      runningBacktests,
      completedBacktests,
      competitionSettings,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.submission.count(),
      prisma.backtestJob.count({ where: { status: "RUNNING" } }),
      prisma.backtestJob.count({ where: { status: "COMPLETED" } }),
      prisma.competitionSettings.findUnique({ where: { id: "global" } }),
    ]);

    // Ensure competition settings exists, if not provide default
    const status = competitionSettings?.competitionStatus || "REGISTRATION_OPEN";

    return NextResponse.json({
      teamsCount,
      submissionsCount,
      runningBacktests,
      completedBacktests,
      competitionStatus: status,
    });
  } catch (error) {
    console.error("Admin metrics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
