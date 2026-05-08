// Single-admin cookie auth.
// Cookie value = HMAC-SHA256(ADMIN_PASSWORD, "pt-admin|" + expiresAtMs)
// Stored as `${expiresAtMs}.${hex}`. Verifying recomputes and compares.
// Web Crypto only — works in middleware (Edge) and server actions (Node).

import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pt-admin";
export const ADMIN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const enc = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeSessionToken(password: string, expiresAt: number): Promise<string> {
  const sig = await hmacHex(password, `pt-admin|${expiresAt}`);
  return `${expiresAt}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  password: string | undefined
): Promise<boolean> {
  if (!token || !password) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = await hmacHex(password, `pt-admin|${expiresAt}`);
  // constant-time-ish compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export async function isLoggedIn(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token, password);
}
