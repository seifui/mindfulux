import { Suspense } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { PrinciplesFilter } from "@/components/features/PrinciplesFilter";
import { PrinciplesGrid } from "@/components/features/PrinciplesGrid";

// ── Mock data ────────────────────────────────────────────────────────────────

const PLACEHOLDER_DESC =
  "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.";

interface Principle {
  title: string;
  category: string;
  description: string;
}

const ALL_PRINCIPLES: Principle[] = [
  {
    title: "Centre-Stage Effect",
    category: "Psychology",
    description:
      "Items placed in the centre of a set are more likely to be chosen. Users gravitate toward middle options, making placement a powerful tool for guiding decisions without explicit direction.",
  },
  {
    title: "Chronoception",
    category: "Perception",
    description:
      "Time perception can be manipulated through design. Engaging interactions make waits feel shorter, while empty loading states amplify impatience. Design that respects perceived time builds trust.",
  },
  {
    title: "Chunking",
    category: "Memory",
    description:
      "Grouping individual pieces of information into larger meaningful units significantly improves recall and reduces cognitive load. Phone numbers and progress steps are classic applications.",
  },
  {
    title: "Cognitive Tax",
    category: "Cognitive",
    description:
      "Every design decision imposes a mental cost on the user. Unnecessary steps, unclear labels, and dense layouts drain attention. Reducing cognitive tax is the foundation of mindful design.",
  },
  {
    title: "Von Restorff Effect",
    category: "Attention",
    description:
      "Among similar items, the one that differs most from the rest is most likely to be remembered. Highlighting a primary action or a key piece of content leverages this isolation effect.",
  },
  {
    title: "Hick's Law",
    category: "Design",
    description:
      "The time it takes to make a decision grows logarithmically with the number of choices available. Reducing options at critical moments speeds up decisions and lowers abandonment.",
  },
  {
    title: "Serial Position Effect",
    category: "Memory",
    description:
      "Users best remember items at the beginning (primacy) and end (recency) of a list. Place the most important actions and information in these positions for maximum recall.",
  },
  {
    title: "Social Proof",
    category: "Social",
    description:
      "People look to the actions and opinions of others to determine correct behaviour in ambiguous situations. Ratings, reviews, and user counts all leverage this deeply human tendency.",
  },
  {
    title: "Zeigarnik Effect",
    category: "Psychology",
    description:
      "People remember uncompleted tasks better than completed ones. Progress indicators, streaks, and open loops exploit this tendency to keep users engaged and motivated to finish.",
  },
  {
    title: "Fitts's Law",
    category: "Design",
    description:
      "The time to acquire a target is a function of the distance to and size of the target. Larger, closer interactive elements are faster to reach — a critical principle for touch and pointer interfaces.",
  },
  {
    title: "Loss Aversion",
    category: "Psychology",
    description:
      "People feel the pain of losing something roughly twice as strongly as the pleasure of gaining an equivalent thing. Framing features around what users stand to lose drives stronger action than highlighting gains.",
  },
  {
    title: "Peak-End Rule",
    category: "Perception",
    description:
      "People judge an experience primarily by its most intense moment and how it ended, rather than the sum of every moment. Designing memorable peaks and satisfying endings shapes lasting impressions.",
  },
  {
    title: "Aesthetic-Usability Effect",
    category: "Cognitive",
    description:
      "Users perceive visually attractive interfaces as more usable, even when they are not. A polished aesthetic creates goodwill that increases tolerance for minor usability issues.",
  },
  {
    title: "Miller's Law",
    category: "Memory",
    description:
      "The average person can hold about seven items (plus or minus two) in working memory at once. Designing within this limit prevents overwhelm and helps users process information efficiently.",
  },
];

const CATEGORIES = [
  "All",
  "Psychology",
  "Cognitive",
  "Perception",
  "Memory",
  "Attention",
  "Design",
  "Social",
];

// ── Filtering + sorting (server-side) ────────────────────────────────────────

function getFilteredPrinciples(category?: string, sort?: string): Principle[] {
  let results = [...ALL_PRINCIPLES];

  if (category && category !== "all") {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (sort === "a-z") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "newest") {
    results.reverse();
  }
  // "popular" (default): original order

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

  const principles = getFilteredPrinciples(category, sort);

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
            <PrinciplesFilter categories={CATEGORIES} />
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
