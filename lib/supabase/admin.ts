import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv, getServiceRoleKey } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

let adminClient: SupabaseClient<Database> | null = null;

export function createAdminSupabaseClient(): SupabaseClient<Database> {
  if (adminClient) {
    return adminClient;
  }

  const env = getEnv();
  const serviceRoleKey = getServiceRoleKey();

  adminClient = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
