export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Helper: check admin auth
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("uv_admin_session");
  if (!sessionCookie) return false;
  const user = verifySessionToken(sessionCookie.value);
  return !!user;
}

/**
 * GET: Lists all media assets (metadata only, no heavy image data).
 */
export async function GET() {
  try {
    const db = await connectToDatabase();
    const list = await db.collection("media").find({}).toArray();
    
    // Map and return list
    const formatted = list.map(({ _id, ...item }) => item);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET media error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST: Uploads a media asset (requires admin auth).
 * Accepts FormData with 'file' key.
 */
export async function POST(request) {
  const isAuthed = await checkAdminAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const name = file.name;

    const id = Date.now().toString();
    const url = `/api/media/${id}`;

    const db = await connectToDatabase();

    // 1. Save metadata to "media" collection (keeps it lightweight for listing)
    const mediaMetadata = {
      _id: new ObjectId(),
      id,
      name,
      url,
      mimeType,
    };
    await db.collection("media").insertOne(mediaMetadata);

    // 2. Save heavy payload to "media_contents" collection
    await db.collection("media_contents").insertOne({
      _id: new ObjectId(),
      id,
      data: base64Data,
      mimeType,
    });

    const { _id, ...rest } = mediaMetadata;
    return NextResponse.json(rest);
  } catch (error) {
    console.error("POST media upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
