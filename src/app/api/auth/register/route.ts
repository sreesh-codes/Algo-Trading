import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  university: z.string().min(2, "University is required"),
  studentId: z.string().min(2, "Student ID is required"),
  degree: z.string().min(2, "Degree is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().optional(),
  githubUsername: z.string().optional(),
  codingExperience: z.string().optional(),
  quantExperience: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: { candidateProfile: true }
    });

    if (existingUser && existingUser.candidateProfile) {
      return NextResponse.json(
        { error: "A registration with this email already exists." },
        { status: 400 }
      );
    }

    // Check if competition registration is open
    const settings = await prisma.competitionSettings.findUnique({
      where: { id: "global" }
    });

    if (settings && settings.competitionStatus !== "REGISTRATION_OPEN") {
      return NextResponse.json(
        { error: "Registration is currently closed." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user and candidate profile
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        password: hashedPassword,
      },
      create: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "CANDIDATE",
        isActive: true,
      }
    });

    await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        university: data.university,
        studentId: data.studentId,
        degree: data.degree,
        graduationYear: data.graduationYear,
        phone: data.phone,
        country: data.country,
        githubUsername: data.githubUsername,
        codingExperience: data.codingExperience,
        quantExperience: data.quantExperience,
        agreedToTerms: data.agreedToTerms,
        registrationStatus: "PENDING",
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
