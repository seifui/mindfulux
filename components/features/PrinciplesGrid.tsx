"use client";

import { useState } from "react";

import { PrincipleCard } from "@/components/features/PrincipleCard";

interface Principle {
  title: string;
  category: string;
  description: string;
}

interface PrinciplesGridProps {
  principles: Principle[];
  initialCount?: number;
}

export function PrinciplesGrid({ principles, initialCount = 9 }: PrinciplesGridProps) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? principles : principles.slice(0, initialCount);
  const hasMore = principles.length > initialCount;

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((principle, index) => (
          <PrincipleCard
            key={principle.title}
            title={principle.title}
            description={principle.description}
            className="w-full"
            position={index}
            section="principles-grid"
          />
        ))}
      </div>

      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-transparent px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Show more
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
}
