export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@uvdecor.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * GET: Checks if there is a valid active admin session.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("uv_admin_session");

    if (!sessionCookie) {
      return NextResponse.json({ success: false, user: null });
    }

    const decodedUser = verifySessionToken(sessionCookie.value);
    if (!decodedUser) {
      // Cookie is invalid or expired
      return NextResponse.json({ success: false, user: null });
    }

    return NextResponse.json({ success: true, user: decodedUser });
  } catch (error) {
    console.error("GET auth error:", error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

/**
 * POST: Authenticates admin credentials and sets session cookie.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = { email: ADMIN_EMAIL, uid: "admin_uid" };
      const token = createSessionToken(user);

      const cookieStore = await cookies();
      cookieStore.set("uv_admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day in seconds
      });

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("POST auth error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Clears the admin session cookie (logout).
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("uv_admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Immediately expires
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE auth error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
