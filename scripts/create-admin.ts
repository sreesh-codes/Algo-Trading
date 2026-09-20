import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function bootstrapAdmin() {
  console.log("Starting Admin Bootstrap Process...");

  const adminEmail = process.env.ADMIN_EMAIL;
  const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!adminEmail) {
    console.error("❌ ADMIN_EMAIL environment variable is missing.");
    process.exit(1);
  }

  if (!bootstrapSecret) {
    console.error("❌ ADMIN_BOOTSTRAP_SECRET environment variable is missing.");
    process.exit(1);
  }

  // Very basic check to ensure the user is providing the secret as an arg
  // e.g. npm run create-admin -- <secret>
  const providedSecret = process.argv[2];
  if (providedSecret !== bootstrapSecret) {
    console.error("❌ Invalid or missing bootstrap secret provided as argument.");
    console.log("Usage: npx tsx scripts/create-admin.ts <ADMIN_BOOTSTRAP_SECRET>");
    process.exit(1);
  }

  try {
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: "ADMIN",
        isActive: true,
      },
      create: {
        email: adminEmail,
        name: "System Administrator",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log(`✅ Admin account successfully created/updated for ${adminEmail}`);
    console.log("You can now log in via OAuth with this email address to access the /admin dashboard.");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrapAdmin();
