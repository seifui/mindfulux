import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";

export type PublishedPrinciple = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
  principle_number: number;
};

export type PrincipleListItem = PublishedPrinciple & {
  category: string | null;
  created_at: string;
};

const FALLBACK: PublishedPrinciple[] = [
  {
    id: "fallback-fitts",
    slug: "fitts-law",
    title: "Fitts's Law",
    description:
      "The time to acquire a target is a function of the distance to and size of the target. Larger, closer interactive elements are faster to reach.",
    illustration_url: "/illustrations/centre-stage-effect.png",
    principle_number: 1,
  },
  {
    id: "fallback-hick",
    slug: "hicks-law",
    title: "Hick's Law",
    description:
      "The time it takes to make a decision grows with the number of choices. Reducing options at critical moments speeds up decisions.",
    illustration_url: "/illustrations/centre-stage-effect.png",
    principle_number: 2,
  },
];

export async function getPublishedPrinciples(
  limit?: number,
): Promise<PublishedPrinciple[]> {
  const supabase = await createClient();
  if (!supabase) {
    return FALLBACK.slice(0, limit ?? FALLBACK.length);
  }

  let query = supabase
    .from("principles")
    .select("id, slug, title, description, illustration_url, principle_number")
    .eq("published", true)
    .order("principle_number", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return FALLBACK.slice(0, limit ?? FALLBACK.length);
  }

  return data as PublishedPrinciple[];
}

export async function getPublishedPrinciplesList(): Promise<PrincipleListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("principles")
    .select(
      "id, slug, title, description, illustration_url, principle_number, category, created_at",
    )
    .eq("published", true)
    .order("principle_number", { ascending: true });

  if (error || !data?.length) {
    return FALLBACK.map((p) => ({
      ...p,
      category: null,
      created_at: new Date().toISOString(),
    }));
  }

  return data as PrincipleListItem[];
}

export type PrincipleDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
  principle_number: number;
  category: string | null;
  what_is_it: string | null;
  history: string | null;
  psychology_behind: string | null;
  why_it_matters: string | null;
  how_to_apply: string | null;
  theory_in_action: string | null;
  final_thought: string | null;
  what_is_it_image_url: string | null;
  theory_in_action_image_urls: string[] | null;
};

export type PrincipleTeaser = {
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
  principle_number: number;
  category: string | null;
};

const DETAIL_SELECT =
  "id, slug, title, description, illustration_url, principle_number, category, what_is_it, what_is_it_image_url, history, psychology_behind, why_it_matters, how_to_apply, theory_in_action, theory_in_action_image_urls, final_thought";

const TEASER_SELECT =
  "slug, title, description, illustration_url, principle_number, category";

export async function getPrincipleDetail(
  slug: string,
): Promise<PrincipleDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("principles")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as PrincipleDetail;
}

/** Safe metadata for locked principles — no long-form content. Service role only. */
export async function getPrincipleTeaser(
  slug: string,
): Promise<PrincipleTeaser | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("principles")
    .select(TEASER_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as PrincipleTeaser;
}

/** Homepage A/B/C carousels — driven by `principles.home_section`. */
export type HomeSection = "a" | "b" | "c";

export async function getPrinciplesForHomeSection(
  section: HomeSection,
): Promise<PublishedPrinciple[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("principles")
    .select("id, slug, title, description, illustration_url, principle_number")
    .eq("published", true)
    .eq("home_section", section)
    .order("principle_number", { ascending: true });

  if (error || !data?.length) return [];
  return data as PublishedPrinciple[];
}
