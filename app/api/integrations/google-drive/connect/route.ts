import { NextResponse } from "next/server";
import { getGoogleDriveEnv, isGoogleDriveConfigured } from "@/lib/google-drive/env";
import { createOAuthState, googleDriveOAuthCookie } from "@/lib/google-drive/oauth-state";
import { getAuthContext } from "@/services/auth.service";
import { googleDriveAuthorizationUrl } from "@/services/google-drive.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await getAuthContext();
  if (auth.kind !== "active") return NextResponse.redirect(new URL("/?drive=unauthenticated", request.url));
  if (!isGoogleDriveConfigured()) return NextResponse.redirect(new URL("/?drive=configuration", request.url));
  const env = getGoogleDriveEnv();
  const oauth = createOAuthState(auth.member.id, env.GOOGLE_DRIVE_OAUTH_STATE_SECRET);
  const response = NextResponse.redirect(googleDriveAuthorizationUrl(oauth.state));
  response.cookies.set(googleDriveOAuthCookie.name, oauth.cookieValue, googleDriveOAuthCookie.options);
  return response;
}
