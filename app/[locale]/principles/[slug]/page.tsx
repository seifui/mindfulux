import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image, { type StaticImageData } from "next/image";

import { Navbar } from "@/components/layout/Navbar";
import { PrincipleUpgradeWall } from "@/components/features/PrincipleUpgradeWall";
import { PrincipleViewTracker } from "@/components/features/PrincipleViewTracker";
import { getPrincipleLimit, getUserTier } from "@/lib/access";
import { getImageUrl } from "@/lib/cloudflare-images";
import {
  getPrincipleDetail,
  getPrincipleTeaser,
} from "@/lib/principles";
import { BackButton } from "./BackButton";

import defaultPrincipleHero from "../../../../public/illustrations/centre-stage-effect-detail.png";

const DETAIL_HERO_FALLBACK_PATH =
  "/illustrations/centre-stage-effect-detail.png";

/** DB often returns "" instead of null; `??` does not fall back for empty string. */
function principleHeroSrc(
  illustrationUrl: string | null | undefined
): string | StaticImageData {
  const t = illustrationUrl?.trim();
  if (!t || t.toLowerCase() === "null") return defaultPrincipleHero;
  return getImageUrl(t, { fallback: DETAIL_HERO_FALLBACK_PATH });
}

function hasImageRef(ref: string | null | undefined): boolean {
  const t = ref?.trim();
  return Boolean(t && t.toLowerCase() !== "null");
}

// ── Content helpers ────────────────────────────────────────────────────────────

/**
 * Splits "Bold part — rest of sentence" into [boldPart, rest].
 * Returns null if no recognised separator is found.
 */
function splitBoldPattern(text: string): [string, string] | null {
  const emDash = text.indexOf(" \u2014 ");
  if (emDash !== -1) return [text.slice(0, emDash), text.slice(emDash + 3)];
  const dash = text.indexOf(" - ");
  if (dash !== -1) return [text.slice(0, dash), text.slice(dash + 3)];
  return null;
}

function InlineText({ text }: { text: string }) {
  const parts = splitBoldPattern(text.trim());
  if (parts) {
    return (
      <>
        <strong className="font-bold">{parts[0]}</strong>
        {" \u2014 "}
        {parts[1]}
      </>
    );
  }
  return <>{text.trim()}</>;
}

// ── Theory in Action section — each item has a caption + image placeholder ────

function TheoryInActionSection({
  title,
  content,
  imageUrls,
}: {
  title: string;
  content: string | null;
  imageUrls: string[] | null;
}) {
  if (!content) return null;

  const hasBullets = content.includes("\u25CF") || content.includes("\u2022");
  const items = hasBullets
    ? content.split(/[\u25CF\u2022]/).map((s) => s.trim()).filter(Boolean)
    : content.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div>
      <h2 className="font-display font-semibold text-detail-heading text-ink-secondary mb-4">
        Theory in Action
      </h2>
      <div className="flex flex-col gap-8">
        {items.map((item, i) => {
          const ref = imageUrls?.[i];
          const showImage = hasImageRef(ref);
          const src = showImage ? getImageUrl(ref) : "";

          return (
            <div key={i} className="flex flex-col gap-3">
              <p className="font-sans font-medium text-base text-ink-secondary">
                <InlineText text={item} />
              </p>
              {showImage ? (
                <div className="flex justify-center overflow-hidden rounded-skill bg-skill-card p-4 md:p-6">
                  <Image
                    src={src}
                    alt={`${title} — Theory in action ${i + 1}`}
                    width={1200}
                    height={1600}
                    className="h-auto w-auto max-h-[min(70vh,560px)] max-w-full object-contain"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>
              ) : (
                <div className="min-h-[200px] w-full rounded-skill bg-skill-card" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section body (shared by Section + WhatIsItSection) ────────────────────────

function SectionBody({ content }: { content: string }) {
  const hasBullets = content.includes("\u25CF") || content.includes("\u2022");

  if (hasBullets) {
    const items = content
      .split(/[\u25CF\u2022]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-accent-brand mt-1">•</span>
            <span className="font-sans font-medium text-base text-ink-secondary">
              <InlineText text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  const paragraphs = content.split("\n").filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="font-sans font-medium text-base text-ink-secondary">
          <InlineText text={p} />
        </p>
      ))}
    </div>
  );
}

function WhatIsItSection({
  title,
  content,
  imageUrl,
}: {
  title: string;
  content: string | null;
  imageUrl: string | null;
}) {
  if (!content && !hasImageRef(imageUrl)) return null;

  const showImage = hasImageRef(imageUrl);
  const src = showImage ? getImageUrl(imageUrl) : "";

  return (
    <div>
      <h2 className="font-display font-semibold text-detail-heading text-ink-secondary mb-4">
        What Is It?
      </h2>
      {content ? <SectionBody content={content} /> : null}
      {showImage && (
        <div className="mt-6 overflow-hidden rounded-skill bg-principle-detail-hero-well">
          <Image
            src={src}
            alt={`${title} — What is it`}
            width={672}
            height={378}
            className="mx-auto h-auto w-full max-h-[480px] object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}
    </div>
  );
}

// ── Section component ──────────────────────────────────────────────────────────

function Section({ heading, content }: { heading: string; content: string | null }) {
  if (!content) return null;

  return (
    <div>
      <h2 className="font-display font-semibold text-detail-heading text-ink-secondary mb-4">
        {heading}
      </h2>
      <SectionBody content={content} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const principle =
    (await getPrincipleDetail(slug)) ?? (await getPrincipleTeaser(slug));

  if (!principle) {
    return { title: "Principle not found" };
  }

  return {
    title: `${principle.title} — MindfulUX Growth`,
    description: principle.description ?? undefined,
  };
}

export default async function PrincipleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const userTier = await getUserTier();
  const principleLimit = getPrincipleLimit(userTier);
  const principle = await getPrincipleDetail(slug);

  if (!principle) {
    const teaser = await getPrincipleTeaser(slug);
    if (!teaser || teaser.principle_number <= principleLimit) {
      notFound();
    }

    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-content px-6 py-10 md:px-0">
          <BackButton />
          <PrincipleUpgradeWall principle={teaser} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <PrincipleViewTracker
        slug={principle.slug}
        category={principle.category ?? ""}
      />

      <main className="max-w-content mx-auto px-6 md:px-0 py-10 w-full">

        {/* Back button */}
        <BackButton />

        {/* Title — ClashDisplay, detail-title scale (~62px desktop) */}
        <h1 className="font-display font-semibold text-detail-title leading-none text-ink mt-6 mb-8">
          {principle.title}
        </h1>

        {/* Illustration — 16:7 wide */}
        <div className="relative mb-8 aspect-[16/7] w-full overflow-hidden rounded-illustration bg-principle-detail-hero-well">
          <Image
            src={principleHeroSrc(principle.illustration_url)}
            alt={principle.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>

        {/* Description / subtitle — Inter Medium, 24px, leading-[32px], tracking-[-0.48px] */}
        <p className="font-sans font-medium text-detail-tagline text-ink-secondary mb-12">
          {principle.description}
        </p>

        {/* Content sections */}
        <div className="space-y-12">
          <WhatIsItSection
            title={principle.title}
            content={principle.what_is_it}
            imageUrl={principle.what_is_it_image_url}
          />
          <Section heading="History" content={principle.history} />
          <Section heading="The Psychology Behind It" content={principle.psychology_behind} />
          <Section heading="Why It Matters" content={principle.why_it_matters} />
          <Section heading="How to Apply It" content={principle.how_to_apply} />
          <TheoryInActionSection
            title={principle.title}
            content={principle.theory_in_action}
            imageUrls={principle.theory_in_action_image_urls}
          />
        </div>

        {/* Final Thought */}
        {principle.final_thought && (
          <div className="mt-12">
            <h2 className="font-display font-semibold text-detail-heading text-ink-secondary mb-3">Final Thought</h2>
            <p className="font-sans font-medium text-base text-ink-secondary">
              {principle.final_thought}
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
