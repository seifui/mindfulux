import { createClient } from "@/lib/supabase/server";

/** 1 = anonymous visitor, 2 = signed-in user (full catalogue). */
export type UserTier = 1 | 2;

export const TOTAL_PRINCIPLES = 150;
export const ANONYMOUS_PRINCIPLE_LIMIT = 30;

export function getPrincipleLimit(tier: UserTier): number {
  return tier === 1 ? ANONYMOUS_PRINCIPLE_LIMIT : TOTAL_PRINCIPLES;
}

export async function getUserTier(): Promise<UserTier> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? 2 : 1;
}

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
