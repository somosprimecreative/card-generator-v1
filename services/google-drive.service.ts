import "server-only";

import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { decrypt, encrypt } from "@/lib/google-drive/crypto";
import { getGoogleDriveEnv, isGoogleDriveConfigured } from "@/lib/google-drive/env";
import type { ActiveAuthMember } from "@/lib/auth/types";

const CONNECTIONS_TABLE = "google_drive_connections";
const DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const PIXEL_FOLDER_NAME = "Pixel";

type ConnectionRow = {
  team_member_id: string;
  workspace_id: string;
  refresh_token_ciphertext: string;
  refresh_token_iv: string;
  folder_id: string;
};

type GoogleTokenResponse = { access_token?: string; refresh_token?: string; expires_in?: number; error?: string; error_description?: string };
type DriveFileResponse = { id?: string; name?: string; webViewLink?: string; error?: { message?: string } };

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180) || "pixel-export";
}

async function connectionFor(member: ActiveAuthMember) {
  const { data, error } = await getAdminSupabaseClient()
    .from(CONNECTIONS_TABLE)
    .select("team_member_id, workspace_id, refresh_token_ciphertext, refresh_token_iv, folder_id")
    .eq("team_member_id", member.id)
    .eq("workspace_id", member.workspaceId)
    .maybeSingle();
  if (error) throw new Error("Não foi possível consultar a conexão com o Google Drive.");
  return data as ConnectionRow | null;
}

async function requestAccessToken(refreshToken: string) {
  const env = getGoogleDriveEnv();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.GOOGLE_DRIVE_CLIENT_ID, client_secret: env.GOOGLE_DRIVE_CLIENT_SECRET, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const body = await response.json() as GoogleTokenResponse;
  if (!response.ok || !body.access_token) throw new Error("A autorização do Google Drive expirou ou foi revogada. Conecte a conta novamente.");
  return body.access_token;
}

async function createFolder(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: PIXEL_FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
  });
  const body = await response.json() as DriveFileResponse;
  if (!response.ok || !body.id) throw new Error(body.error?.message || "Não foi possível criar a pasta Pixel no Google Drive.");
  return body.id;
}

async function uploadFile(accessToken: string, folderId: string, file: File) {
  const boundary = `pixel-${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: cleanFileName(file.name), mimeType: file.type || "application/octet-stream", parents: [folderId] });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`),
    Buffer.from(await file.arrayBuffer()),
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
  const payload = await response.json() as DriveFileResponse;
  if (!response.ok || !payload.id || !payload.name) throw new Error(payload.error?.message || `Não foi possível enviar ${file.name} ao Google Drive.`);
  return { id: payload.id, name: payload.name, webViewLink: payload.webViewLink };
}

export function googleDriveConfiguration() {
  return { configured: isGoogleDriveConfigured() };
}

export async function googleDriveStatus(member: ActiveAuthMember) {
  if (!isGoogleDriveConfigured()) return { configured: false, connected: false };
  return { configured: true, connected: Boolean(await connectionFor(member)) };
}

export function googleDriveAuthorizationUrl(state: string) {
  const env = getGoogleDriveEnv();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: env.GOOGLE_DRIVE_CLIENT_ID, redirect_uri: env.GOOGLE_DRIVE_REDIRECT_URI, response_type: "code", scope: DRIVE_FILE_SCOPE, access_type: "offline", prompt: "consent", include_granted_scopes: "true", state }).toString();
  return url;
}

export async function completeGoogleDriveAuthorization(member: ActiveAuthMember, code: string) {
  const env = getGoogleDriveEnv();
  const existingConnection = await connectionFor(member);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: env.GOOGLE_DRIVE_CLIENT_ID, client_secret: env.GOOGLE_DRIVE_CLIENT_SECRET, redirect_uri: env.GOOGLE_DRIVE_REDIRECT_URI, grant_type: "authorization_code" }),
  });
  const tokens = await tokenResponse.json() as GoogleTokenResponse;
  if (!tokenResponse.ok || !tokens.access_token || !tokens.refresh_token) throw new Error("O Google não forneceu uma autorização persistente. Tente conectar novamente.");
  const folderId = existingConnection?.folder_id ?? await createFolder(tokens.access_token);
  const encrypted = encrypt(tokens.refresh_token, env.GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY);
  const { error } = await getAdminSupabaseClient().from(CONNECTIONS_TABLE).upsert({
    team_member_id: member.id,
    workspace_id: member.workspaceId,
    refresh_token_ciphertext: encrypted.ciphertext,
    refresh_token_iv: encrypted.iv,
    folder_id: folderId,
  }, { onConflict: "team_member_id" });
  if (error) throw new Error("O Google Drive foi autorizado, mas não foi possível guardar a conexão com segurança.");
}

export async function uploadPixelExports(member: ActiveAuthMember, files: File[]) {
  const connection = await connectionFor(member);
  if (!connection) throw new Error("Conecte o Google Drive antes de enviar exportações.");
  const refreshToken = decrypt({ ciphertext: connection.refresh_token_ciphertext, iv: connection.refresh_token_iv }, getGoogleDriveEnv().GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY);
  const accessToken = await requestAccessToken(refreshToken);
  return Promise.all(files.map((file) => uploadFile(accessToken, connection.folder_id, file)));
}

export async function disconnectGoogleDrive(member: ActiveAuthMember) {
  const connection = await connectionFor(member);
  if (!connection) return { revoked: true };
  const refreshToken = decrypt({ ciphertext: connection.refresh_token_ciphertext, iv: connection.refresh_token_iv }, getGoogleDriveEnv().GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY);
  let revoked = false;
  try {
    const response = await fetch("https://oauth2.googleapis.com/revoke", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: refreshToken }) });
    revoked = response.ok;
  } catch {
    revoked = false;
  }
  const { error } = await getAdminSupabaseClient().from(CONNECTIONS_TABLE).delete().eq("team_member_id", member.id).eq("workspace_id", member.workspaceId);
  if (error) throw new Error("Não foi possível remover a conexão local com o Google Drive.");
  return { revoked };
}
