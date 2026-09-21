import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { z } from "zod";

const StatusSchema = z.object({
  status: z.enum(["REGISTRATION_OPEN", "ACTIVE", "PAUSED", "COMPLETED"]),
});

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const result = StatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid status provided." },
        { status: 400 }
      );
    }

    const { status } = result.data;

    // Update global competition settings
    const settings = await prisma.competitionSettings.upsert({
      where: { id: "global" },
      update: {
        competitionStatus: status,
      },
      create: {
        id: "global",
        competitionStatus: status,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin competition status POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
