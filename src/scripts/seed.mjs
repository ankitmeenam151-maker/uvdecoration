/**
 * MongoDB Seed Script
 * Run with: node scripts/seed.mjs
 * 
 * This will populate all collections with default website data.
 * Run this once after connecting MongoDB for the first time.
 */

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

if (!uri || uri.includes("<db_password>")) {
  console.error("\n❌ ERROR: MONGODB_URI is not set or still contains <db_password>.");
  console.error("Please update the MONGODB_URI in your .env file with your actual MongoDB password.\n");
  process.exit(1);
}

async function seed() {
  console.log("\n🌱 Starting MongoDB seed...");
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@")); // Hide password in logs

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!\n");

    const db = client.db("uv_decor");

    // ---- SEED SINGLE DOCUMENT COLLECTIONS (in 'website' collection) ----
    const websiteItems = ["hero", "contact", "seo", "settings"];
    for (const key of websiteItems) {
      const existing = await db.collection("website").findOne({ _id: key });
      if (existing) {
        console.log(`⏭  '${key}' already exists — skipping (keeping existing data).`);
      } else {
        await db.collection("website").insertOne({ _id: key, ...SEED_DATA[key] });
        console.log(`✅ Seeded '${key}' successfully.`);
      }
    }

    // ---- SEED MULTI-DOCUMENT COLLECTIONS ----
    const listCollections = ["themes", "pricing", "addons", "portfolio", "testimonials", "media"];
    for (const key of listCollections) {
      const count = await db.collection(key).countDocuments();
      if (count > 0) {
        console.log(`⏭  '${key}' already has ${count} documents — skipping (keeping existing data).`);
      } else {
        await db.collection(key).insertMany(SEED_DATA[key]);
        console.log(`✅ Seeded '${key}' with ${SEED_DATA[key].length} items.`);
      }
    }

    console.log("\n🎉 Seeding complete! Your MongoDB database is ready.");
    console.log("   You can now open http://localhost:3000 and visit /admin to manage content.\n");
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    if (err.message.includes("ECONNREFUSED") || err.message.includes("querySrv")) {
      console.error("👉 Make sure your MONGODB_URI has the correct password in .env\n");
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
