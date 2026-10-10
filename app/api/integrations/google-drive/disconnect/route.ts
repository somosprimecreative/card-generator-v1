import { getAuthContext } from "@/services/auth.service";
import { googleDriveConfiguration, disconnectGoogleDrive } from "@/services/google-drive.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const auth = await getAuthContext();
  if (auth.kind !== "active") return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  if (!googleDriveConfiguration().configured) return Response.json({ error: "A integração com Google Drive ainda não foi configurada." }, { status: 503 });
  try {
    return Response.json(await disconnectGoogleDrive(auth.member));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível desconectar o Google Drive." }, { status: 502 });
  }
}
