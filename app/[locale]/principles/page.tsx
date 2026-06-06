import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { LockedSection } from "@/components/features/LockedSection";
import { Navbar } from "@/components/layout/Navbar";
import { PrinciplesFilter } from "@/components/features/PrinciplesFilter";
import { PrinciplesGrid } from "@/components/features/PrinciplesGrid";
import { TOTAL_PRINCIPLES, getUserTier } from "@/lib/access";
import {
  getPublishedPrinciplesList,
  type PrincipleListItem,
} from "@/lib/principles";

function buildCategories(principles: PrincipleListItem[]): string[] {
  const labels = new Set<string>();
  for (const p of principles) {
    const c = p.category?.trim();
    if (c) labels.add(c);
  }
  return ["All", ...Array.from(labels).sort((a, b) => a.localeCompare(b))];
}

function getFilteredPrinciples(
  principles: PrincipleListItem[],
  category?: string,
  sort?: string,
): PrincipleListItem[] {
  let results = [...principles];

  if (category && category !== "all") {
    results = results.filter(
      (p) => (p.category ?? "").toLowerCase() === category.toLowerCase(),
    );
  }

  if (sort === "a-z") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "number") {
    results.sort((a, b) => a.principle_number - b.principle_number);
  } else if (sort === "newest") {
    results.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  return results;
}

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

type SearchParams = { category?: string; sort?: string };

export default async function PrinciplesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, sort } = await searchParams;
  const userTier = await getUserTier();
  const t = await getTranslations("access");

  const allPrinciples = await getPublishedPrinciplesList();
  const categories = buildCategories(allPrinciples);
  const principles = getFilteredPrinciples(allPrinciples, category, sort);

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col pb-20">
        <header className="flex flex-col gap-3 pb-8 pt-10 md:pb-10 md:pt-14">
          <h1 className="max-w-[560px] font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
            UX Psychology Principles
          </h1>
          <p className="text-sm text-muted-text">
            {t("showingCount", {
              visible: allPrinciples.length,
              total: TOTAL_PRINCIPLES,
            })}
          </p>
        </header>

        <div className="mb-8">
          <Suspense fallback={<FilterSkeleton />}>
            <PrinciplesFilter categories={categories} />
          </Suspense>
        </div>

        {principles.length > 0 ? (
          <PrinciplesGrid principles={principles} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              No principles found
            </p>
            <p className="text-sm text-muted-text">
              Try a different category or{" "}
              <a
                href="/principles"
                className="text-accent-brand underline-offset-2 hover:underline"
              >
                clear all filters
              </a>
              .
            </p>
          </div>
        )}

        <LockedSection userTier={userTier} />
      </main>
    </div>
  );
}
