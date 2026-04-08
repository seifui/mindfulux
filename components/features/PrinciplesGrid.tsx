"use client";

import { useRef, useState } from "react";

import { PrincipleCard } from "@/components/features/PrincipleCard";

interface Principle {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  illustration_url: string | null;
}

interface PrinciplesGridProps {
  principles: Principle[];
  initialCount?: number;
}

const GRID_REGION_ID = "principles-grid-region";

export function PrinciplesGrid({
  principles,
  initialCount = 8,
}: PrinciplesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? principles : principles.slice(0, initialCount);
  const hasMore = principles.length > initialCount;

  function handleToggle() {
    if (showAll) {
      setShowAll(false);
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setShowAll(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        ref={gridRef}
        id={GRID_REGION_ID}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {visible.map((principle, index) => (
          <div key={principle.id} className="h-full">
            <PrincipleCard
              title={principle.title}
              description={principle.description ?? ""}
              slug={principle.slug}
              imageUrl={principle.illustration_url ?? undefined}
              className="w-full"
              position={index}
              section="principles-grid"
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-transparent px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          aria-expanded={showAll}
          aria-controls={GRID_REGION_ID}
        >
          {showAll ? "Show less" : "Show more"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {showAll ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
