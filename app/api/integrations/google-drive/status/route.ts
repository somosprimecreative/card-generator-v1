import { getAuthContext } from "@/services/auth.service";
import { googleDriveStatus } from "@/services/google-drive.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthContext();
  if (auth.kind !== "active") return Response.json({ error: "unauthenticated" }, { status: 401 });
  try {
    return Response.json(await googleDriveStatus(auth.member));
  } catch {
    return Response.json({ error: "connection" }, { status: 503 });
  }
}
