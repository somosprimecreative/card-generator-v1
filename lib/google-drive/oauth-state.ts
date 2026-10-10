import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "pixel_google_drive_oauth";
const MAX_AGE_SECONDS = 10 * 60;

type OAuthStatePayload = { state: string; memberId: string; expiresAt: number };

const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf8");
const sign = (value: string, secret: string) => createHmac("sha256", secret).update(value).digest("base64url");

export function createOAuthState(memberId: string, secret: string) {
  const payload: OAuthStatePayload = { state: randomBytes(32).toString("base64url"), memberId, expiresAt: Date.now() + MAX_AGE_SECONDS * 1000 };
  const body = encode(JSON.stringify(payload));
  return { state: payload.state, cookieValue: `${body}.${sign(body, secret)}` };
}

export function verifyOAuthState(cookieValue: string | undefined, state: string | null, memberId: string, secret: string) {
  if (!cookieValue || !state) return false;
  const [body, signature] = cookieValue.split(".");
  if (!body || !signature) return false;
  const expected = Buffer.from(sign(body, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
  try {
    const payload = JSON.parse(decode(body)) as OAuthStatePayload;
    return payload.memberId === memberId && payload.state === state && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export const googleDriveOAuthCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
  options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/api/integrations/google-drive/callback", maxAge: MAX_AGE_SECONDS },
};
