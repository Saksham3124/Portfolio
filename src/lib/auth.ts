import crypto from "crypto";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_EXPIRY_DAYS = 7;

// Generate or use a secret key for session HMAC signing
const HMAC_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "portfolio-admin-super-secure-hmac-secret-key-2026";

// Path for storing custom password hash if changed via admin panel
function getAuthFilePath(): string {
  const localPath = path.join(process.cwd(), "src", "data", "adminAuth.json");
  const localDir = path.dirname(localPath);
  if (fs.existsSync(localDir)) {
    try {
      // test write access
      fs.accessSync(localDir, fs.constants.W_OK);
      return localPath;
    } catch {
      // Fallback to /tmp on serverless read-only filesystems
    }
  }
  return path.join("/tmp", "adminAuth.json");
}

/**
 * Hash a password using PBKDF2 with SHA-512 and a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain password against a stored "salt:hash" string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;

    const hashToVerify = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    const originalBuffer = Buffer.from(originalHash, "hex");
    const verifyBuffer = Buffer.from(hashToVerify, "hex");

    if (originalBuffer.length !== verifyBuffer.length) return false;
    return crypto.timingSafeEqual(originalBuffer, verifyBuffer);
  } catch {
    return false;
  }
}

/**
 * Get current stored password hash or fallback to env / default
 */
export function getStoredPasswordHash(): string | null {
  const authFile = getAuthFilePath();
  if (fs.existsSync(authFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(authFile, "utf-8"));
      if (data && data.passwordHash) {
        return data.passwordHash;
      }
    } catch {
      // ignore read error
    }
  }
  return null;
}

/**
 * Save new encrypted password hash
 */
export function savePasswordHash(hash: string): boolean {
  try {
    const authFile = getAuthFilePath();
    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      authFile,
      JSON.stringify(
        {
          passwordHash: hash,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the given password is valid for admin access
 */
export function checkAdminPassword(password: string): boolean {
  const storedHash = getStoredPasswordHash();
  if (storedHash) {
    return verifyPassword(password, storedHash);
  }

  // If no custom password hash stored yet, check env variable or default
  const configuredPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === configuredPassword;
}

/**
 * Create a signed session token
 */
export function createSessionToken(): string {
  const payload = {
    user: "admin",
    exp: Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    rnd: crypto.randomBytes(8).toString("hex"),
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

/**
 * Verify a session token string
 */
export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadString, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", HMAC_SECRET)
      .update(payloadString)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    const payload = JSON.parse(
      Buffer.from(payloadString, "base64url").toString("utf-8")
    );
    if (!payload || !payload.exp) return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Set session cookie in Next.js Server Action / Route Handler
 */
export function setSessionCookie(): void {
  const token = createSessionToken();
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if the request is authenticated from cookies
 */
export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
