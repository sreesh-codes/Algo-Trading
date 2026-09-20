import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export async function GET(req: Request) {
  try {
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session; // Return the 401/403 if unauthorized

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "ALL";

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { candidateProfile: { studentId: { contains: search, mode: "insensitive" } } },
        { candidateProfile: { university: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (statusFilter !== "ALL") {
      where.candidateProfile = {
        ...where.candidateProfile,
        registrationStatus: statusFilter,
      };
    }

    // Only fetch candidates, not admins
    where.role = "CANDIDATE";

    const users = await prisma.user.findMany({
      where,
      include: {
        candidateProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error("Admin candidates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
