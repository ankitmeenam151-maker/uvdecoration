import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "uv_decor_fallback_secret_key_987654321";

/**
 * Creates a signed session token.
 */
export function createSessionToken(user) {
  const payload = JSON.stringify({
    email: user.email,
    uid: user.uid,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours session
  });
  
  const payloadB64 = Buffer.from(payload).toString("base64");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("hex");
    
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a session token. Returns the user details or null if invalid/expired.
 */
export function verifySessionToken(token) {
  if (!token) return null;
  
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  
  const [payloadB64, signature] = parts;
  
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadB64)
    .digest("hex");
    
  if (signature !== expectedSignature) {
    return null; // Tampered!
  }
  
  try {
    const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
    const data = JSON.parse(payload);
    
    if (data.expiresAt < Date.now()) {
      return null; // Expired!
    }
    
    return { email: data.email, uid: data.uid };
  } catch (e) {
    return null;
  }
}
