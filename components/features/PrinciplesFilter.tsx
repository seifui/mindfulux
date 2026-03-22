"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

interface PrinciplesFilterProps {
  categories: string[];
}

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "a-z", label: "A–Z" },
  { value: "newest", label: "Newest" },
] as const;

export function PrinciplesFilter({ categories }: PrinciplesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "";
  const hasActiveFilters = activeCategory !== "" || activeSort !== "";

  const buildHref = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      return qs ? `/principles?${qs}` : "/principles";
    },
    [searchParams],
  );

  const handleCategoryClick = (category: string) => {
    router.push(buildHref({ category: category === activeCategory ? null : category }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildHref({ sort: e.target.value || null }));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Category pills — scrollable on mobile, wrapping on desktop */}
      <div className="-mx-6 flex gap-2 overflow-x-auto scroll-smooth px-6 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((cat) => {
          const isActive = cat === "All" ? activeCategory === "" : activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat === "All" ? "" : cat)}
              className={cn(
                "shrink-0 rounded-pill border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-dark bg-brand-dark text-cream"
                  : "border-border-subtle bg-transparent text-ink hover:border-brand-dark hover:text-brand-dark",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Right side: sort + clear all */}
      <div className="flex shrink-0 items-center gap-3">
        {hasActiveFilters && (
          <a
            href="/principles"
            className="text-sm font-medium text-accent-brand underline-offset-2 hover:underline"
          >
            Clear all
          </a>
        )}

        <div className="relative">
          <select
            value={activeSort}
            onChange={handleSortChange}
            aria-label="Sort principles"
            className="appearance-none rounded-pill border border-border-subtle bg-transparent py-2 pl-4 pr-9 text-sm font-medium text-ink outline-none focus:border-brand-dark"
          >
            <option value="">Sort by</option>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}
