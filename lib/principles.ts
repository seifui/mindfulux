import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabaseClient } from "@/lib/supabase";

export type PublishedPrinciple = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
};

const FALLBACK: PublishedPrinciple[] = [
  {
    id: "fallback-fitts",
    slug: "fitts-law",
    title: "Fitts's Law",
    description:
      "The time to acquire a target is a function of the distance to and size of the target. Larger, closer interactive elements are faster to reach.",
    illustration_url: "/illustrations/centre-stage-effect.png",
  },
  {
    id: "fallback-hick",
    slug: "hicks-law",
    title: "Hick's Law",
    description:
      "The time it takes to make a decision grows with the number of choices. Reducing options at critical moments speeds up decisions.",
    illustration_url: "/illustrations/centre-stage-effect.png",
  },
];

export async function getPublishedPrinciples(
  limit: number
): Promise<PublishedPrinciple[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return FALLBACK.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("principles")
    .select("id, slug, title, description, illustration_url")
    .eq("published", true)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data?.length) {
    return FALLBACK.slice(0, limit);
  }

  return data as PublishedPrinciple[];
}

export type PrincipleDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
  category: string | null;
  what_is_it: string | null;
  history: string | null;
  psychology_behind: string | null;
  why_it_matters: string | null;
  how_to_apply: string | null;
  theory_in_action: string | null;
  final_thought: string | null;
};

export async function getPrincipleDetail(
  slug: string
): Promise<PrincipleDetail | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("principles")
    .select(
      "id, slug, title, description, illustration_url, category, what_is_it, history, psychology_behind, why_it_matters, how_to_apply, theory_in_action, final_thought"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data as PrincipleDetail;
}

/** Homepage A/B/C carousels — driven by `principles.home_section`, not title prefix. */
export type HomeSection = "a" | "b" | "c";

export async function getPrinciplesForHomeSection(
  section: HomeSection,
): Promise<PublishedPrinciple[]> {
  /** Public read matches `/principles`; RLS allows select. Avoids requiring service role on the homepage. */
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("principles")
    .select("id, slug, title, description, illustration_url")
    .eq("published", true)
    .eq("home_section", section)
    .order("title", { ascending: true });

  if (error || !data?.length) return [];
  return data as PublishedPrinciple[];
}
