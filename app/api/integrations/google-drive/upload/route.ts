import { getAuthContext } from "@/services/auth.service";
import { googleDriveConfiguration, uploadPixelExports } from "@/services/google-drive.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 12;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const acceptedTypes = new Set(["image/png", "image/jpeg", "application/zip"]);

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (auth.kind !== "active") return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  if (!googleDriveConfiguration().configured) return Response.json({ error: "A integração com Google Drive ainda não foi configurada." }, { status: 503 });
  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((value): value is File => value instanceof File);
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (!files.length || files.length > MAX_FILES || totalBytes > MAX_TOTAL_BYTES || files.some((file) => !acceptedTypes.has(file.type))) {
      return Response.json({ error: "Envie somente exportações PNG, JPG ou ZIP de até 25 MB no total." }, { status: 400 });
    }
    return Response.json({ uploaded: await uploadPixelExports(auth.member, files) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível enviar os arquivos ao Google Drive." }, { status: 502 });
  }
}
