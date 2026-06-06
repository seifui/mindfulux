import { createClient } from "@/lib/supabase/client";

/** @deprecated Prefer `createClient()` from `@/lib/supabase/client` or server. */
export function getSupabaseClient() {
  return createClient();
}
