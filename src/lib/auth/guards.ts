import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "./options";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireCandidate() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Forbidden: Candidates only" }, { status: 403 });
  }
  if (!session.user.isActive) {
    return NextResponse.json({ error: "Forbidden: Account disabled" }, { status: 403 });
  }
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }
  if (!session.user.isActive) {
    return NextResponse.json({ error: "Forbidden: Account disabled" }, { status: 403 });
  }
  return session;
}
