import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/layout/Navbar";
import { PrincipleCard } from "@/components/features/PrincipleCard";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BulletItem {
  bold?: string;
  text: string;
}

interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: BulletItem[];
}

interface TheoryExample {
  caption: string;
}

interface PrincipleDetail {
  title: string;
  slug: string;
  category: string;
  tagline: string;
  imageUrl: string;
  sections: ContentSection[];
  theoryInAction: TheoryExample[];
  finalThought: string[];
  related: { title: string; description: string }[];
}

// ── Static mock data ──────────────────────────────────────────────────────────

const PRINCIPLES: PrincipleDetail[] = [
  {
    title: "Centre Stage Effect",
    slug: "centre-stage-effect",
    category: "UX Psychology",
    tagline:
      "When feelings decide before facts and why your brain trusts them more than logic.",
    imageUrl: "/illustrations/centre-stage-effect.png",
    sections: [
      {
        heading: "What Is It?",
        paragraphs: [
          "People tend to choose the middle option when presented with a group of choices. The central position feels more balanced, important, and trustworthy — even when all options are equal.",
          'For example, if asked to pick a number between 1 and 12, many people instinctively choose 7, since it feels "in the middle."',
        ],
      },
      {
        heading: "History",
        paragraphs: [
          "First identified in consumer psychology experiments by researchers such as Paul Rodway (University of Chester, 2012), the Centre-Stage Effect shows that people unconsciously associate the middle position with higher quality or social approval.",
          'From supermarket shelves to digital menus, the center often becomes the default "safe choice."',
        ],
      },
      {
        heading: "The Psychology Behind It",
        paragraphs: [
          "Our brains are drawn to symmetry and balance.",
          "The center of a layout naturally feels more prominent and valuable — it's where leaders sit at a table, and where our eyes tend to rest first.",
          "This subtle bias affects both physical and digital choices, leading users to select whatever feels central or featured.",
        ],
      },
      {
        heading: "Why It Matters",
        paragraphs: [],
        bullets: [
          { text: "Encourages predictable selection patterns" },
          { text: "Can bias user choices toward middle options" },
          { text: "Reduces exploration of edge content" },
          { text: "May distort perceived value or fairness" },
        ],
      },
      {
        heading: "How to Apply It",
        paragraphs: [],
        bullets: [
          {
            bold: "Use the center strategically",
            text: " — Place key or recommended items there.",
          },
          {
            bold: "Rotate layout positions",
            text: " — Use dynamic displays to prevent bias.",
          },
          {
            bold: "Guide attention consciously",
            text: " — Apply hierarchy, spacing, and color contrast to influence focus intentionally.",
          },
          {
            bold: "Test for balance",
            text: " — Track clicks and engagement across all item positions.",
          },
        ],
      },
    ],
    theoryInAction: [
      {
        caption:
          'E-commerce sites often place featured or "best value" plans in the middle, knowing users will gravitate there.',
      },
      {
        caption:
          "Restaurant menus highlight signature dishes in central columns to boost sales.",
      },
    ],
    finalThought: [
      "The center carries silent power.",
      "Use it to guide — not manipulate — your users.",
      "When balanced with transparency, the center can become a tool for clarity and smarter decision-making.",
    ],
    related: [
      {
        title: "Von Restorff Effect",
        description:
          "Among similar items, the one that differs most from the rest is most likely to be remembered. Highlighting a primary action or a key piece of content leverages this isolation effect.",
      },
      {
        title: "Hick's Law",
        description:
          "The time it takes to make a decision grows logarithmically with the number of choices available. Reducing options at critical moments speeds up decisions and lowers abandonment.",
      },
      {
        title: "Serial Position Effect",
        description:
          "Users best remember items at the beginning (primacy) and end (recency) of a list. Place the most important actions and information in these positions for maximum recall.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPrinciple(slug: string): PrincipleDetail | undefined {
  return PRINCIPLES.find((p) => p.slug === slug);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BackButton() {
  return (
    <Link
      href="/principles"
      className="inline-flex items-center gap-1.5 self-start rounded-pill border border-border-subtle bg-transparent px-5 py-3.5 font-sans text-sm font-semibold text-ink-secondary transition-colors hover:border-ink-secondary"
    >
      {/* arrow-narrow-left icon — Figma node I4648:2334;274:8142 */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15.833 10H4.167M4.167 10L9.167 15M4.167 10L9.167 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </Link>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center self-start rounded-pill bg-card-fill px-4 py-1 font-sans text-sm font-semibold text-accent">
      {category}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-semibold text-detail-heading text-ink-secondary">
      {children}
    </h2>
  );
}

function ContentBlock({ section }: { section: ContentSection }) {
  return (
    <div className="flex flex-col gap-3.5">
      <SectionHeading>{section.heading}</SectionHeading>

      {section.paragraphs.map((para, i) => (
        <p key={i} className="font-sans font-medium text-base text-ink-secondary">
          {para}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="flex flex-col gap-2 font-sans font-medium text-base text-ink-secondary">
          {section.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-secondary" aria-hidden="true" />
              <span>
                {bullet.bold && (
                  <strong className="font-bold">{bullet.bold}</strong>
                )}
                {bullet.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PrincipleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const principle = getPrinciple(slug);

  if (!principle) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center py-20">
          <p className="font-display text-xl font-semibold text-ink">
            Principle not found.
          </p>
          <Link
            href="/principles"
            className="mt-4 font-sans text-sm text-accent underline-offset-2 hover:underline"
          >
            Back to all principles
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col pb-20">
        {/* ── Article column (680px max, centred) ─────────────────────────── */}
        <article className="mx-auto w-full max-w-content pt-8 flex flex-col gap-5">

          {/* Back navigation */}
          <BackButton />

          {/* Title */}
          <h1 className="font-display font-semibold text-detail-title text-ink">
            {principle.title}
          </h1>

          {/* Hero illustration — Figma node 4648:2484 */}
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-illustration bg-tan">
            <Image
              src="/illustrations/centre-stage-effect-detail.png"
              alt="Centre Stage Effect illustration"
              width={840}
              height={480}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Tagline — Figma node 4648:2344 */}
          <p className="font-sans font-medium text-detail-tagline text-ink-secondary">
            {principle.tagline}
          </p>

          {/* Content sections */}
          <div className="flex flex-col gap-11">
            {principle.sections.map((section) => (
              <ContentBlock key={section.heading} section={section} />
            ))}

            {/* Theory in Action — Figma node 4648:2355 */}
            <div className="flex flex-col gap-3.5">
              <SectionHeading>Theory in Action</SectionHeading>
              <div className="flex flex-col gap-8">
                {principle.theoryInAction.map((example, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <p className="font-sans font-medium text-base text-ink-secondary">
                      {example.caption}
                    </p>
                    <div className="h-80 w-full rounded-skill bg-skill-card" />
                  </div>
                ))}
              </div>
            </div>

            {/* Final Thought — Figma node 4648:2367 */}
            <div className="flex flex-col gap-4">
              <SectionHeading>Final Thought</SectionHeading>
              <div className="flex flex-col font-sans font-medium text-base text-ink-secondary">
                {principle.finalThought.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ── Related principles ───────────────────────────────────────────── */}
        {principle.related.length > 0 && (
          <section className="mt-16 flex flex-col gap-7">
            <h2 className="font-display font-semibold text-2xl text-ink">
              Related Principles
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {principle.related.map((rel) => (
                <PrincipleCard
                  key={rel.title}
                  title={rel.title}
                  description={rel.description}
                  className="w-full"
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
