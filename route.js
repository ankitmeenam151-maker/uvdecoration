import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * GET: Serves media files directly from MongoDB.
 */
export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response("Missing id parameter", { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    
    // Find file content
    const fileContent = await db.collection("media_contents").findOne({ id });

    if (!fileContent) {
      return new Response("File not found", { status: 404 });
    }

    const buffer = Buffer.from(fileContent.data, "base64");

    return new Response(buffer, {
      headers: {
        "Content-Type": fileContent.mimeType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error(`Error serving media ${id}:`, error);
    return new Response("Internal server error", { status: 500 });
  }
}
