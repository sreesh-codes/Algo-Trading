import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.competitionSettings.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      return NextResponse.json(
        { status: "REGISTRATION_OPEN", start: null, end: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: settings.competitionStatus,
        start: settings.competitionStart,
        end: settings.competitionEnd,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch competition status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
