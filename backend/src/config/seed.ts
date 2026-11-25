import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { Auth } from "../modules/auth/auth.model.js";
import connectToDB from "./db.js";

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;
  const fullName = process.env.SEED_ADMIN_NAME!;

  await connectToDB();

  try {
    const existing = await Auth.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      console.log(`Admin already exists (${email})`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Auth.create({
      fullName,
      email,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log(`Seeded ADMIN user successfully: ${email}`);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
