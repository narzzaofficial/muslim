import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

let publicClient: SupabaseClient<Database> | null = null;

export function createPublicSupabaseClient(): SupabaseClient<Database> {
  if (publicClient) {
    return publicClient;
  }

  const env = getEnv();
  publicClient = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return publicClient;
}
