import { Suspense } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { PrinciplesFilter } from "@/components/features/PrinciplesFilter";
import { PrinciplesGrid } from "@/components/features/PrinciplesGrid";
import { getSupabaseClient } from "@/lib/supabase";

// ── Supabase listing row ─────────────────────────────────────────────────────

type PrincipleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  illustration_url: string | null;
  category: string | null;
  created_at: string;
};

async function fetchPublishedPrinciples(): Promise<PrincipleRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("principles")
    .select(
      "id, slug, title, description, illustration_url, category, created_at",
    )
    .eq("published", true)
    .order("title", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as PrincipleRow[];
}

function buildCategories(principles: PrincipleRow[]): string[] {
  const labels = new Set<string>();
  for (const p of principles) {
    const c = p.category?.trim();
    if (c) labels.add(c);
  }
  return ["All", ...Array.from(labels).sort((a, b) => a.localeCompare(b))];
}

// ── Filtering + sorting (server-side) ────────────────────────────────────────

function getFilteredPrinciples(
  principles: PrincipleRow[],
  category?: string,
  sort?: string,
): PrincipleRow[] {
  let results = [...principles];

  if (category && category !== "all") {
    results = results.filter(
      (p) => (p.category ?? "").toLowerCase() === category.toLowerCase(),
    );
  }

  if (sort === "a-z") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "newest") {
    results.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  // "popular" (default): title order from fetch

  return results;
}

// ── Filter skeleton ───────────────────────────────────────────────────────────

function FilterSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-9 w-20 shrink-0 animate-pulse rounded-pill bg-border-subtle"
        />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = { category?: string; sort?: string };

export default async function PrinciplesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, sort } = await searchParams;

  const allPrinciples = await fetchPublishedPrinciples();
  const categories = buildCategories(allPrinciples);
  const principles = getFilteredPrinciples(allPrinciples, category, sort);

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col pb-20">
        {/* Page header */}
        <header className="flex flex-col gap-3 pt-10 pb-8 md:pt-14 md:pb-10">
          <h1 className="font-display font-semibold leading-none tracking-[-0.03em] text-ink text-[clamp(2rem,5vw,3.5rem)] max-w-[560px]">
            UX Psychology Principles
          </h1>
        </header>

        {/* Filter + sort bar */}
        <div className="mb-8">
          <Suspense fallback={<FilterSkeleton />}>
            <PrinciplesFilter categories={categories} />
          </Suspense>
        </div>

        {/* Principles grid */}
        {principles.length > 0 ? (
          <PrinciplesGrid principles={principles} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              No principles found
            </p>
            <p className="text-sm text-muted-text">
              Try a different category or{" "}
              <a href="/principles" className="text-accent-brand hover:underline underline-offset-2">
                clear all filters
              </a>
              .
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
