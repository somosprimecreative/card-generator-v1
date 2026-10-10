import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGoogleDriveEnv, isGoogleDriveConfigured } from "@/lib/google-drive/env";
import { googleDriveOAuthCookie, verifyOAuthState } from "@/lib/google-drive/oauth-state";
import { getAuthContext } from "@/services/auth.service";
import { completeGoogleDriveAuthorization } from "@/services/google-drive.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function finish(request: Request, result: string) {
  const response = NextResponse.redirect(new URL(`/?drive=${result}`, request.url));
  response.cookies.set(googleDriveOAuthCookie.name, "", { ...googleDriveOAuthCookie.options, maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  if (!isGoogleDriveConfigured()) return finish(request, "configuration");
  const auth = await getAuthContext();
  if (auth.kind !== "active") return finish(request, "unauthenticated");
  const url = new URL(request.url);
  if (url.searchParams.get("error")) return finish(request, "denied");
  const code = url.searchParams.get("code");
  const cookie = (await cookies()).get(googleDriveOAuthCookie.name)?.value;
  const env = getGoogleDriveEnv();
  if (!code || !verifyOAuthState(cookie, url.searchParams.get("state"), auth.member.id, env.GOOGLE_DRIVE_OAUTH_STATE_SECRET)) return finish(request, "invalid-state");
  try {
    await completeGoogleDriveAuthorization(auth.member, code);
    return finish(request, "connected");
  } catch {
    return finish(request, "error");
  }
}
