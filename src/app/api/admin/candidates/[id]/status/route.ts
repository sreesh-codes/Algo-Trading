import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "DISABLED", "REGISTERED"]),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    const { id: userId } = await context.params;
    const body = await req.json();
    const data = statusSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true }
    });

    if (!user || user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Update status
    await prisma.$transaction(async (tx) => {
      await tx.candidateProfile.update({
        where: { userId },
        data: { registrationStatus: data.status }
      });

      // If status is DISABLED, we might also want to set user.isActive to false
      if (data.status === "DISABLED") {
        await tx.user.update({
          where: { id: userId },
          data: { isActive: false }
        });
      } else {
        await tx.user.update({
          where: { id: userId },
          data: { isActive: true }
        });
      }

      // Log the action
      await tx.auditLog.create({
        data: {
          adminUserId: (session as any).user.id,
          targetUserId: userId,
          action: `CANDIDATE_${data.status}`,
          metadata: JSON.stringify({ previousStatus: user.candidateProfile?.registrationStatus }),
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        }
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    console.error("Patch candidate status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
