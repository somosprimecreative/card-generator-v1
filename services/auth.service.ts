import "server-only";

import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin-env";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthActionResult, AuthContext, AuthFailureCode } from "@/lib/auth/types";

const credentialsSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });
type MembershipStatus = "active" | "pending_invite" | "inactive" | "removed";
type MemberRow = { id: string; auth_user_id: string | null; workspace_id: string; name: string; email: string; status: MembershipStatus };
type WorkspaceRow = { id: string; name: string };

function statusFailure(status: MembershipStatus): AuthFailureCode {
  if (status === "pending_invite") return "pending_invite";
  if (status === "inactive") return "inactive";
  if (status === "removed") return "removed";
  return "unlinked_member";
}

async function resolveMemberByAuthUserId(authUserId: string): Promise<AuthContext> {
  if (!isSupabaseAdminConfigured()) return { kind: "configuration" };
  try {
    const admin = getAdminSupabaseClient();
    const { data: member, error: memberError } = await admin
      .from("team_members").select("id, auth_user_id, workspace_id, name, email, status")
      .eq("auth_user_id", authUserId).maybeSingle();
    if (memberError) return { kind: "connection" };
    if (!member) return { kind: "unlinked_member" };
    const teamMember = member as MemberRow;
    if (teamMember.status !== "active") return { kind: statusFailure(teamMember.status) };
    const { data: workspace, error: workspaceError } = await admin.from("workspaces").select("id, name").eq("id", teamMember.workspace_id).maybeSingle();
    if (workspaceError) return { kind: "connection" };
    if (!workspace) return { kind: "workspace_missing" };
    const workspaceRow = workspace as WorkspaceRow;
    return { kind: "active", member: { id: teamMember.id, authUserId, workspaceId: teamMember.workspace_id, workspaceName: workspaceRow.name, name: teamMember.name, email: teamMember.email, status: "active" } };
  } catch {
    return { kind: "connection" };
  }
}

/** Auth identity and active membership always come from the Órbita Prime workspace. */
export async function getAuthContext(): Promise<AuthContext> {
  if (!isSupabaseConfigured()) return { kind: "configuration" };
  try {
    const supabase = await getServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { kind: "unauthenticated" };
    return resolveMemberByAuthUserId(data.user.id);
  } catch {
    return { kind: "connection" };
  }
}

export async function loginWithPassword(input: unknown): Promise<AuthActionResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_credentials" };
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) return { ok: false, code: "configuration" };
  try {
    const supabase = await getServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user || !data.session) return { ok: false, code: "invalid_credentials" };
    const context = await resolveMemberByAuthUserId(data.user.id);
    if (context.kind !== "active") {
      await supabase.auth.signOut();
      return { ok: false, code: context.kind === "unauthenticated" ? "unlinked_member" : context.kind };
    }
    await getAdminSupabaseClient().from("team_members").update({ last_access_at: new Date().toISOString() }).eq("id", context.member.id);
    return { ok: true, member: context.member };
  } catch {
    return { ok: false, code: "connection" };
  }
}

export async function logoutCurrentSession() {
  if (!isSupabaseConfigured()) return;
  try { await (await getServerSupabaseClient()).auth.signOut(); }
  catch { /* The next request remains unauthenticated if the provider is unavailable. */ }
}
