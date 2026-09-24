import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES, ROLE_PERMISSIONS } from "../src/lib/auth/permissions";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@school.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const rolesCollection = db.collection("roles");
  const usersCollection = db.collection("users");

  // Seed roles
  const roleEntries = Object.entries(ROLES);
  for (const [, slug] of roleEntries) {
    const permissions = ROLE_PERMISSIONS[slug] ?? [];
    const existing = await rolesCollection.findOne({ slug });
    if (existing) {
      await rolesCollection.updateOne(
        { slug },
        { $set: { permissions, updatedAt: new Date() } }
      );
      console.log(`Updated role: ${slug}`);
    } else {
      await rolesCollection.insertOne({
        name: slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        slug,
        description: `${slug} role`,
        permissions,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created role: ${slug}`);
    }
  }

  // Seed super admin user
  const superAdminRole = await rolesCollection.findOne({
    slug: ROLES.SUPER_ADMIN,
  });
  if (!superAdminRole) {
    console.error("Super admin role not found");
    process.exit(1);
  }

  const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await usersCollection.insertOne({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: superAdminRole._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  console.log("Seed completed");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
