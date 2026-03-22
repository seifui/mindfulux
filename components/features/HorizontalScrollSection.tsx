"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollSectionProps {
  title: string;
  children: React.ReactNode;
}

/* Card w-[297px] + gap-5 (20px) */
const SCROLL_AMOUNT = 317;

export function HorizontalScrollSection({
  title,
  children,
}: HorizontalScrollSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    rowRef.current?.scrollBy({
      left: direction === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-7.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold leading-none text-ink">
          {title}
        </h2>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll("left")}
            className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-transparent transition-colors hover:bg-card-fill"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll("right")}
            className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-transparent transition-colors hover:bg-card-fill"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
      >
        {children}
      </div>
    </div>
  );
}
