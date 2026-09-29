import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getAdminSupabaseEnv } from "./admin-env";

/** Trusted server-only access to the shared Prime Supabase project. */
export function getAdminSupabaseClient() {
  const env = getAdminSupabaseEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
