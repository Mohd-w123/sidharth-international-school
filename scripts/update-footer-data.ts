import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/saint-lawrence";

async function runUpdateFooter() {
  console.log("Connecting to MongoDB to update footer content...", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  const usersCollection = db.collection("users");
  const adminUser = await usersCollection.findOne({});
  const adminId = adminUser?._id || new mongoose.Types.ObjectId();

  const menusCollection = db.collection("menus");
  const siteSettingsCollection = db.collection("sitesettings");

  console.log("1. Updating Column 2: Footer Menu (Quick Links)...");

  const cleanFooterMenu = {
    name: "Quick Links (Footer)",
    slug: "quick-links-footer",
    location: "footer",
    isActive: true,
    createdBy: adminId,
    updatedBy: adminId,
    items: [
      {
        label: "About School",
        url: "/about-us",
        target: "_self",
        isEnabled: true,
        order: 0,
        children: [],
      },
      {
        label: "Management & Board",
        url: "/management-and-board",
        target: "_self",
        isEnabled: true,
        order: 1,
        children: [],
      },
      {
        label: "Admissions 2026-27",
        url: "/admissions",
        target: "_self",
        isEnabled: true,
        order: 2,
        children: [],
      },
      {
        label: "Fee Structure",
        url: "/fee-structure",
        target: "_self",
        isEnabled: true,
        order: 3,
        children: [],
      },
      {
        label: "Facilities & Labs",
        url: "/facilities",
        target: "_self",
        isEnabled: true,
        order: 4,
        children: [],
      },
      {
        label: "Campus Gallery",
        url: "/gallery",
        target: "_self",
        isEnabled: true,
        order: 5,
        children: [],
      },
    ],
    updatedAt: new Date(),
  };

  await menusCollection.updateOne(
    { location: "footer" },
    { $set: cleanFooterMenu },
    { upsert: true }
  );
  console.log("✓ Successfully updated Quick Links (Footer Menu)!");

  console.log("2. Updating Column 3: Secondary Menu (CBSE & Compliance)...");

  const cleanSecondaryMenu = {
    name: "CBSE & Compliance (Footer)",
    slug: "cbse-compliance-footer",
    location: "secondary",
    isActive: true,
    createdBy: adminId,
    updatedBy: adminId,
    items: [
      {
        label: "Mandatory Public Disclosure",
        url: "/mandatory-disclosure",
        target: "_self",
        isEnabled: true,
        order: 0,
        children: [],
      },
      {
        label: "Academic Calendar 2026-27",
        url: "/mandatory-disclosure",
        target: "_self",
        isEnabled: true,
        order: 1,
        children: [],
      },
      {
        label: "Fee Structure & Rules",
        url: "/fee-structure",
        target: "_self",
        isEnabled: true,
        order: 2,
        children: [],
      },
      {
        label: "School Management Committee (SMC)",
        url: "/management-and-board",
        target: "_self",
        isEnabled: true,
        order: 3,
        children: [],
      },
      {
        label: "Admission Guidelines",
        url: "/admission-guidelines",
        target: "_self",
        isEnabled: true,
        order: 4,
        children: [],
      },
      {
        label: "Contact Admissions Office",
        url: "/contact",
        target: "_self",
        isEnabled: true,
        order: 5,
        children: [],
      },
    ],
    updatedAt: new Date(),
  };

  await menusCollection.updateOne(
    { location: "secondary" },
    { $set: cleanSecondaryMenu },
    { upsert: true }
  );
  console.log("✓ Successfully updated CBSE & Compliance (Secondary Menu)!");

  console.log("3. Updating Contact Settings for Column 4 (Contact Us)...");

  const contactSettings = [
    {
      key: "address",
      value: "Goner Road, Near Ring Road Flyover, Jaipur, Rajasthan - 303905",
      group: "contact",
      label: "Campus Address",
      type: "textarea",
    },
    {
      key: "phone",
      value: "+91 9216079411, +91 9216079412",
      group: "contact",
      label: "Primary Contact Phone",
      type: "text",
    },
    {
      key: "email",
      value: "stlawrencegnr@gmail.com",
      group: "contact",
      label: "Primary Contact Email",
      type: "text",
    },
    {
      key: "facebook",
      value: "https://facebook.com",
      group: "social",
      label: "Facebook URL",
      type: "url",
    },
    {
      key: "instagram",
      value: "https://instagram.com",
      group: "social",
      label: "Instagram URL",
      type: "url",
    },
  ];

  for (const s of contactSettings) {
    await siteSettingsCollection.updateOne(
      { key: s.key },
      {
        $set: {
          ...s,
          updatedBy: adminId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`✓ Updated setting: ${s.key}`);
  }

  await mongoose.disconnect();
  console.log("Footer content and menus successfully updated!");
}

runUpdateFooter().catch((err) => {
  console.error("Footer update error:", err);
  process.exit(1);
});
