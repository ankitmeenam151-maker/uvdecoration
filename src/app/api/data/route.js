export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { SEED_DATA } from "@/lib/seedData";

// Helper: check admin auth via HttpOnly cookie
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("uv_admin_session");
  if (!sessionCookie) return false;
  const user = verifySessionToken(sessionCookie.value);
  return !!user;
}

/**
 * GET: Fetches data for homepage / dashboard based on "key" query param.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();

    // 1. Single Document collections stored in the "website" collection
    if (["hero", "contact", "seo", "settings", "founder"].includes(key)) {
      const doc = await db.collection("website").findOne({ _id: key });
      if (doc) {
        // Auto-migrate placeholder phone if it is still the default seed one
        if (key === "contact" && doc.phone === "+91 99999 99999") {
          await db.collection("website").updateOne(
            { _id: "contact" },
            { $set: { phone: "+91 62661 74324" } }
          );
          doc.phone = "+91 62661 74324";
        }
        // Auto-migrate founder image if it is empty, unset, or set to the broken ibb.co viewer link
        if (key === "founder" && (!doc.image || doc.image === "" || doc.image.includes("ibb.co"))) {
          await db.collection("website").updateOne(
            { _id: "founder" },
            { $set: { image: "/images/founder.jpg" } }
          );
          doc.image = "/images/founder.jpg";
        }
        // Return without _id metadata
        const { _id, ...rest } = doc;
        return NextResponse.json(rest);
      }
      
      // Seed if not exists
      const initialData = { _id: key, ...SEED_DATA[key] };
      await db.collection("website").insertOne(initialData);
      return NextResponse.json(SEED_DATA[key]);
    }

    // 2. Multi-document collections
    if (["themes", "pricing", "addons", "portfolio", "testimonials", "media", "team"].includes(key)) {
      const list = await db.collection(key).find({}).toArray();
      if (list.length > 0) {
        // Map _id to string id if id doesn't exist, and remove _id
        return NextResponse.json(list.map(({ _id, ...item }) => ({ ...item })));
      }

      // Seed if empty
      const seededItems = SEED_DATA[key].map(item => ({
        _id: new ObjectId(),
        ...item
      }));
      
      await db.collection(key).insertMany(seededItems);
      return NextResponse.json(SEED_DATA[key]);
    }

    return NextResponse.json({ error: `Invalid key: ${key}` }, { status: 400 });
  } catch (error) {
    console.error(`GET database error for key ${key}:`, error);
    // Return seed fallback in dev/local mode if MongoDB connection is pending or fails, so site doesn't blank out
    return NextResponse.json(SEED_DATA[key] || { error: "Database error" }, { status: 500 });
  }
}

/**
 * POST: Create operation (requires auth except for contact submissions).
 */
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const body = await request.json();

    // Handle Contact Inquiry Submissions (Publicly accessible, NO AUTH check)
    if (key === "contact_submission") {
      const db = await connectToDatabase();
      const newSubmission = {
        id: Date.now().toString(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        dateSubmitted: new Date().toISOString()
      };

      // Contact document in website collection contains submissions array
      const doc = await db.collection("website").findOne({ _id: "contact" });
      const currentContact = doc || { _id: "contact", ...SEED_DATA.contact };
      const submissions = currentContact.submissions || [];
      submissions.unshift(newSubmission);

      await db.collection("website").updateOne(
        { _id: "contact" },
        { $set: { submissions } },
        { upsert: true }
      );

      return NextResponse.json({ success: true, submission: newSubmission });
    }

    // Require authentication for all administrative POSTs
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    
    // Add to Multi-document collections
    if (["themes", "pricing", "addons", "portfolio", "testimonials", "media", "team"].includes(key)) {
      const newId = Date.now().toString();
      const newItem = {
        _id: new ObjectId(),
        id: newId,
        ...body
      };

      await db.collection(key).insertOne(newItem);
      const { _id, ...rest } = newItem;
      return NextResponse.json(rest);
    }

    return NextResponse.json({ error: "Invalid write operation" }, { status: 400 });
  } catch (error) {
    console.error("POST database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT: Update operation (requires auth).
 */
export async function PUT(request) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const id = searchParams.get("id");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const body = await request.json();

    // 1. Update single document config items
    if (["hero", "contact", "seo", "settings", "founder"].includes(key)) {
      // Remove metadata _id if passed in body
      const { _id, ...updateData } = body;
      await db.collection("website").updateOne(
        { _id: key },
        { $set: updateData },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    // 2. Reorder themes (updates entire themes collection)
    if (key === "themes" && !id && Array.isArray(body)) {
      // Clear collection and insert all
      await db.collection("themes").deleteMany({});
      if (body.length > 0) {
        const formatted = body.map(item => ({
          _id: new ObjectId(),
          ...item
        }));
        await db.collection("themes").insertMany(formatted);
      }
      return NextResponse.json({ success: true });
    }

    // 3. Update individual item in multi-document collection
    if (id && ["themes", "pricing", "addons", "testimonials", "team"].includes(key)) {
      const { _id, ...updateData } = body;
      const result = await db.collection(key).updateOne(
        { id: id },
        { $set: updateData }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid edit operation" }, { status: 400 });
  } catch (error) {
    console.error("PUT database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE: Delete operation (requires auth).
 */
export async function DELETE(request) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const id = searchParams.get("id");

  if (!key || !id) {
    return NextResponse.json({ error: "Missing key or id parameter" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();

    if (["themes", "pricing", "addons", "portfolio", "testimonials", "media", "team"].includes(key)) {
      const result = await db.collection(key).deleteOne({ id: id });
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid delete operation" }, { status: 400 });
  } catch (error) {
    console.error("DELETE database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
