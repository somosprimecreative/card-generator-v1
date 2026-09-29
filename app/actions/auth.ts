"use server";

import { loginWithPassword, logoutCurrentSession } from "@/services/auth.service";

export async function loginAction(input: { email: string; password: string }) {
  return loginWithPassword(input);
}

export async function logoutAction() {
  await logoutCurrentSession();
}
