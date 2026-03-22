"use client";

import { useRef } from "react";

// ── Inline chevron icons (Figma node I4566:1469;2291:3387 / I4566:1470;2291:3387)
// Size 20×20, stroke currentColor, no external icon library.

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12.5 15 7.5 10l5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Illustration (Figma node 4572-1416 "Centre_Stage_Effect - color 1")
// Built from Figma shapes: two-panel line-art scene — a figure on each outer
// edge, city silhouettes flanking a central vertical dividing line that
// embodies the Centre Stage concept.  Aspect ratio 2400:1200 → viewBox 480×240.

function CentreStageIllustration() {
  return (
    <svg
      viewBox="0 0 480 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* background */}
      <rect width="480" height="240" rx="12" fill="#ede8e2" />

      {/* ── LEFT FIGURE ─────────────────────────────────────────────────── */}
      {/* hair bun */}
      <circle cx="75" cy="72" r="5" stroke="#2c2019" strokeWidth="1.2" />
      {/* head */}
      <circle cx="75" cy="84" r="12" stroke="#2c2019" strokeWidth="1.2" />
      {/* neck + torso */}
      <line x1="75" y1="96" x2="75" y2="106" stroke="#2c2019" strokeWidth="1.2" />
      <line x1="75" y1="106" x2="75" y2="150" stroke="#2c2019" strokeWidth="1.2" />
      {/* left arm (at side) */}
      <path
        d="M75 116 Q56 132 53 150"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* right arm (gesturing toward centre) */}
      <path
        d="M75 116 Q94 122 112 120"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* skirt */}
      <path
        d="M63 150 Q54 178 50 198 Q74 190 98 198 Q94 178 87 150 Z"
        fill="#c4897a"
        fillOpacity="0.45"
        stroke="#2c2019"
        strokeWidth="1.2"
      />
      {/* legs */}
      <line x1="60" y1="195" x2="56" y2="220" stroke="#2c2019" strokeWidth="1.2" />
      <line x1="89" y1="195" x2="93" y2="220" stroke="#2c2019" strokeWidth="1.2" />

      {/* ── LEFT CITY ───────────────────────────────────────────────────── */}
      {/* tall institution with battlements */}
      <rect x="148" y="133" width="22" height="54" stroke="#2c2019" strokeWidth="1.2" />
      <rect x="148" y="124" width="5" height="9" stroke="#2c2019" strokeWidth="1.2" />
      <rect x="156.5" y="124" width="5" height="9" stroke="#2c2019" strokeWidth="1.2" />
      <rect x="165" y="124" width="5" height="9" stroke="#2c2019" strokeWidth="1.2" />
      {/* pitched-roof building right */}
      <rect x="174" y="152" width="18" height="35" stroke="#2c2019" strokeWidth="1.2" />
      <path
        d="M172 152 L183 139 L194 152"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* small house left */}
      <rect x="127" y="163" width="16" height="24" stroke="#2c2019" strokeWidth="1.2" />
      <path
        d="M125 163 L135 152 L145 163"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* ground line */}
      <line
        x1="116"
        y1="187"
        x2="198"
        y2="187"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── CENTRE DIVIDING LINE ────────────────────────────────────────── */}
      <line
        x1="240"
        y1="76"
        x2="240"
        y2="206"
        stroke="#2c2019"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* ── RIGHT CITY ──────────────────────────────────────────────────── */}
      {/* pitched-roof building */}
      <rect x="286" y="140" width="20" height="47" stroke="#2c2019" strokeWidth="1.2" />
      <path
        d="M284 140 L296 128 L308 140"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* flat-top building with battlements */}
      <rect x="310" y="148" width="18" height="39" stroke="#2c2019" strokeWidth="1.2" />
      <rect x="310" y="139" width="5" height="9" stroke="#2c2019" strokeWidth="1.2" />
      <rect x="318.5" y="139" width="5" height="9" stroke="#2c2019" strokeWidth="1.2" />
      {/* small house */}
      <rect x="264" y="163" width="16" height="24" stroke="#2c2019" strokeWidth="1.2" />
      <path
        d="M262 163 L272 152 L282 163"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* ground line */}
      <line
        x1="254"
        y1="187"
        x2="336"
        y2="187"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── RIGHT FIGURE (holding book) ─────────────────────────────────── */}
      {/* hair bun */}
      <circle cx="408" cy="72" r="5" stroke="#2c2019" strokeWidth="1.2" />
      {/* head */}
      <circle cx="408" cy="84" r="12" stroke="#2c2019" strokeWidth="1.2" />
      {/* neck + torso */}
      <line x1="408" y1="96" x2="408" y2="106" stroke="#2c2019" strokeWidth="1.2" />
      <line x1="408" y1="106" x2="408" y2="150" stroke="#2c2019" strokeWidth="1.2" />
      {/* left arm extended — holding open book */}
      <path
        d="M408 120 Q390 127 376 135"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* book */}
      <rect
        x="360"
        y="131"
        width="18"
        height="20"
        rx="1"
        stroke="#2c2019"
        strokeWidth="1.2"
      />
      <line x1="369" y1="131" x2="369" y2="151" stroke="#2c2019" strokeWidth="0.8" />
      {/* right arm */}
      <path
        d="M408 116 Q426 126 434 142"
        stroke="#2c2019"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* skirt */}
      <path
        d="M396 150 Q387 178 383 198 Q407 190 431 198 Q427 178 420 150 Z"
        fill="#c4897a"
        fillOpacity="0.45"
        stroke="#2c2019"
        strokeWidth="1.2"
      />
      {/* legs */}
      <line x1="394" y1="195" x2="390" y2="220" stroke="#2c2019" strokeWidth="1.2" />
      <line x1="421" y1="195" x2="425" y2="220" stroke="#2c2019" strokeWidth="1.2" />
    </svg>
  );
}

// ── Card data ────────────────────────────────────────────────────────────────

const SKILLS = [
  {
    title: "Centre Stage Effect",
    description:
      "People tend to choose the item in the middle of a set and perceive it as the most important or preferred option.",
  },
  {
    title: "Chronoception",
    description:
      "How we perceive and interpret time shapes the felt speed, responsiveness, and overall performance of a product.",
  },
  {
    title: "Chunking",
    description:
      "Grouping information into meaningful units reduces cognitive load and improves a user's ability to recall details.",
  },
  {
    title: "Cognitive Load",
    description:
      "Mental effort is a finite resource. Reduce unnecessary friction and respect cognitive limits to improve usability.",
  },
] as const;

// ── Skill card ───────────────────────────────────────────────────────────────

// Figma node 4648-2492: bg-card-fill, rounded-card (12px), p-6 (24px), gap-5 (20px), w-[297px]
// Illustration: aspect-[2/1] (Figma 2400×1200), rounded-[12px]
// Title: Clash Display Semibold 24px / leading-[1.3] / text-ink / w-[231px]
// Description: Inter Medium 14px / leading-5 (20px) / tracking-[-0.28px] / text-ink

interface SkillCardProps {
  title: string;
  description: string;
}

function SkillCard({ title, description }: SkillCardProps) {
  return (
    <article className="flex w-full shrink-0 flex-col gap-5 rounded-card bg-card-fill p-6 md:w-[297px]">
      {/* illustration inset — 2:1 aspect ratio matching Figma asset 2400×1200 */}
      <div className="aspect-[2/1] w-full overflow-hidden rounded-[12px]">
        <CentreStageIllustration />
      </div>

      {/* text block */}
      <div className="flex flex-col gap-2">
        <h3 className="w-[231px] font-display text-[24px] font-semibold leading-[1.3] text-ink">
          {title}
        </h3>
        <p className="font-sans text-sm font-medium leading-5 tracking-[-0.28px] text-ink">
          {description}
        </p>
      </div>
    </article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

// card width 297px + gap 20px = 317px per scroll step
const SCROLL_AMOUNT = 317;

/**
 * Featured skills section — Figma node 4573-1549.
 *
 * Full-bleed `bg-featured-strip` band, max-width capped at `max-w-page`.
 * Header: "Featured skills" heading + prev/next chevron nav buttons.
 * Mobile: single-column vertical stack. Desktop (md+): horizontal scroll row
 * with fixed-width 297px cards and animated prev/next controls.
 */
export function PromoCardsSection() {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") =>
    rowRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip bg-featured-strip px-6 py-12 md:px-10 md:py-14 lg:px-20">
      <div className="mx-auto flex w-full max-w-page flex-col gap-[30px]">

        {/* ── Header row (Figma node 4566-1466) ── */}
        <div className="flex items-center justify-between">
          {/* "Featured skills" — Secondary small: Clash Display Semibold 32px / lh 1 */}
          <h2 className="font-display text-2xl font-semibold leading-none text-ink whitespace-nowrap">
            Featured skills
          </h2>

          {/* Nav buttons — Figma nodes 4566-1469 / 4566-1470
              bg-transparent · border-border-subtle · rounded-full · p-2.5 (10px)
              Chevron icon 20×20 */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Scroll to previous skills"
              onClick={() => scroll("left")}
              className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-transparent text-ink transition-colors hover:bg-card-fill"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Scroll to next skills"
              onClick={() => scroll("right")}
              className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-transparent text-ink transition-colors hover:bg-card-fill"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* ── Card row (Figma node 4573-1548) ──
            Mobile: flex-col (full-width stacked cards).
            Desktop (md+): flex-row overflow-x-auto, each card fixed at 297px,
            gap-5 (20px) between cards. */}
        <div
          ref={rowRef}
          className="flex flex-col gap-5 md:flex-row md:overflow-x-auto md:scroll-smooth md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden"
        >
          {SKILLS.map((skill) => (
            <SkillCard key={skill.title} title={skill.title} description={skill.description} />
          ))}
        </div>

      </div>
    </div>
  );
}
