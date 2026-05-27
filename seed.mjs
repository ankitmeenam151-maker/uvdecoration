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

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env file manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env");
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

const SEED_DATA = {
  hero: {
    heading: "Elevate Your Celebrations with Premium Decor",
    subheading: "Transforming ordinary spaces into extraordinary memories with our 100% custom, artisanal balloon designs.",
    ctaText: "Get Custom Quote",
    ctaLink: "#booking-form",
    heroImage: "/images/hero.png"
  },
  themes: [
    { id: "1", name: "Pastel Dream", image: "/images/birthday.png", desc: "Soft hues for gentle celebrations." },
    { id: "2", name: "Golden Luxury", image: "/images/wedding.png", desc: "Metallic accents for premium events." },
    { id: "3", name: "Organic Blush", image: "/images/hero.png", desc: "Natural flow for any occasion." }
  ],
  pricing: [
    { id: "1", name: "Basic", price: "From $199", features: ["2 Organic Balloon Pillars", "Standard Color Palette (2 Colors)", "Setup & Teardown (Standard Hours)", "Basic Photo Backdrop"], recommended: false },
    { id: "2", name: "Standard", price: "From $499", features: ["Full Organic Arch (8-10ft)", "Premium Chrome & Pastel Palette", "Custom Vinyl Lettering", "Themed Foil Balloons", "Priority Setup Slot"], recommended: true },
    { id: "3", name: "Premium", price: "From $999", features: ["Full Room Transformation", "Custom Floral & Foliage Mix", "Marquee Letters/Numbers", "Metallic & Glitter Accents", "On-site Styling Professional", "Next-day Teardown"], recommended: false }
  ],
  addons: [
    { id: "1", name: "Cake Delivery", price: "+$50" },
    { id: "2", name: "Magician", price: "+$150" },
    { id: "3", name: "Photo Booth", price: "+$300" },
    { id: "4", name: "Puppet Show", price: "+$100" }
  ],
  portfolio: [
    { id: "1", category: "Birthdays", image: "/images/birthday.png", title: "Pastel Princess 1st Birthday" },
    { id: "2", category: "Weddings", image: "/images/wedding.png", title: "Gold & White Elegant Arch" },
    { id: "3", category: "Baby Shower", image: "/images/babyshower.png", title: "Dreamy Cloud Setup" },
    { id: "4", category: "Corporate", image: "/images/hero.png", title: "Grand Opening Gala" },
    { id: "5", category: "Birthdays", image: "/images/after.png", title: "Luxury Living Room Party" },
    { id: "6", category: "Weddings", image: "/images/wedding.png", title: "Floral Fusion Wall" }
  ],
  testimonials: [
    { id: "1", name: "Sarah Johnson", role: "Bride", text: "UV Balloon and Decoration transformed our wedding venue into a fairytale. The organic arch was the talk of the night!", rating: 5, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: "2", name: "Michael Chen", role: "Marketing Director", text: "Professional, punctual, and incredibly creative. They handled our product launch decor with absolute perfection.", rating: 5, avatar: "https://i.pravatar.cc/150?u=michael" },
    { id: "3", name: "Elena Rodriguez", role: "Happy Parent", text: "The 1st birthday setup was beyond my expectations. My daughter loved the colors and the floating teddy bear balloon!", rating: 5, avatar: "https://i.pravatar.cc/150?u=elena" }
  ],
  contact: {
    phone: "1234567890",
    email: "info@uvballoondecoration.com",
    address: "123 Luxury Decor Way, Suite 100, New York, NY",
    submissions: []
  },
  seo: {
    title: "UV Balloon and Decoration | Premium Event Decor",
    description: "Elevate your celebrations with custom, premium balloon decorations for weddings, birthdays, and corporate events.",
    keywords: "balloon decoration, luxury events, party setups, organic balloon arch, premium party decor",
    shareImage: "/images/hero.png"
  },
  settings: {
    logoText: "UV Balloon & Decor",
    logoSub: "Premium Events",
    footerText: "© 2026 UV Balloon and Decoration. All Rights Reserved.",
    socialLinks: { instagram: "#", facebook: "#", pinterest: "#", linkedin: "#" },
    primaryColor: "#FF9A9E",
    secondaryColor: "#D4AF37"
  },
  media: [
    { id: "1", name: "hero.png", url: "/images/hero.png" },
    { id: "2", name: "birthday.png", url: "/images/birthday.png" },
    { id: "3", name: "wedding.png", url: "/images/wedding.png" },
    { id: "4", name: "babyshower.png", url: "/images/babyshower.png" },
    { id: "5", name: "before.png", url: "/images/before.png" },
    { id: "6", name: "after.png", url: "/images/after.png" }
  ]
};

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
