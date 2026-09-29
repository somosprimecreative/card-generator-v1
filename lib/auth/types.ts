export type AuthFailureCode =
  | "unauthenticated"
  | "invalid_credentials"
  | "unlinked_member"
  | "pending_invite"
  | "inactive"
  | "removed"
  | "workspace_missing"
  | "connection"
  | "configuration";

export type ActiveAuthMember = {
  id: string;
  authUserId: string;
  workspaceId: string;
  workspaceName: string;
  name: string;
  email: string;
  status: "active";
};

export type AuthContext = { kind: "active"; member: ActiveAuthMember } | { kind: AuthFailureCode };
export type AuthActionResult = { ok: true; member: ActiveAuthMember } | { ok: false; code: Exclude<AuthFailureCode, "unauthenticated"> };
