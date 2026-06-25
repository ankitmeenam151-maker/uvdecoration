import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SEED_DATA } from "../lib/seedData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env file manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../../.env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = value;
    }
  } catch (e) {
    console.error("Could not read .env file:", e.message);
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1);
}

async function runMigration() {
  console.log("\n🚀 Starting MongoDB SEO & Copy Migration...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("uv_decor");

    // 1. Update SEO Document
    console.log("✏️  Updating website 'seo' document...");
    await db.collection("website").updateOne(
      { _id: "seo" },
      { $set: SEED_DATA.seo },
      { upsert: true }
    );

    // 2. Update Hero Banner Document
    console.log("✏️  Updating website 'hero' document...");
    await db.collection("website").updateOne(
      { _id: "hero" },
      { $set: SEED_DATA.hero },
      { upsert: true }
    );

    // 3. Update Contact Document (Preserving submissions!)
    console.log("✏️  Updating website 'contact' document while preserving client inquiries...");
    const existingContact = await db.collection("website").findOne({ _id: "contact" });
    const submissions = existingContact?.submissions || [];
    await db.collection("website").updateOne(
      { _id: "contact" },
      { $set: { ...SEED_DATA.contact, submissions } },
      { upsert: true }
    );

    // 4. Update Settings Document
    console.log("✏️  Updating website 'settings' document...");
    await db.collection("website").updateOne(
      { _id: "settings" },
      { $set: SEED_DATA.settings },
      { upsert: true }
    );

    // 5. Update Founder Document (Preserving text or seed)
    console.log("✏️  Updating website 'founder' document...");
    await db.collection("website").updateOne(
      { _id: "founder" },
      { $set: SEED_DATA.founder },
      { upsert: true }
    );

    // 6. Update Testimonials (Updating default seeds 1, 2, 3; leaving others intact)
    console.log("✏️  Updating seeded client reviews with targeted local SEO keywords...");
    for (const review of SEED_DATA.testimonials) {
      await db.collection("testimonials").updateOne(
        { id: review.id },
        { $set: review },
        { upsert: true }
      );
    }

    console.log("\n🎉 Database migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runMigration();
