import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { BookLockedPrincipleCard } from "@/components/features/book/BookLockedPrincipleCard";
import { BookNotifyCard } from "@/components/features/book/BookNotifyCard";
import { CommunitySection } from "@/components/features/CommunitySection";
import { PrincipleCard } from "@/components/features/PrincipleCard";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { getPublishedPrinciples } from "@/lib/principles";
import { captureBookPageViewed } from "@/lib/posthog-server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book — launching soon · MindfulUX Growth",
    description:
      "150 UX psychology principles in one book — English and Sinhala. Launching soon.",
  };
}

function StatPill({
  value,
  label,
  align,
  className,
}: {
  value: React.ReactNode;
  label: string;
  align: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[47px] flex-col justify-center rounded-md border border-border-subtle bg-book-surface px-2 py-3.5",
        align === "right" ? "items-end text-right" : "items-start text-left",
        className
      )}
    >
      <span className="text-xs font-semibold leading-[18px] tracking-[-0.24px] text-brand-dark">
        {value}
      </span>
      <span className="text-[10px] font-normal leading-3 tracking-[-0.2px] text-accent-brand">
        {label}
      </span>
    </div>
  );
}

export default async function BookPage() {
  await captureBookPageViewed();
  const t = await getTranslations("book");
  const principles = await getPublishedPrinciples(2);

  const [first, second] = principles;

  return (
    <div className="flex min-h-full flex-col font-sans text-ink">
      <Navbar />

      <main className="flex flex-1 flex-col items-center pb-20">
        {/* Hero */}
        <section className="flex w-full flex-col items-center gap-6 pt-10 text-center md:gap-8 md:pt-14 lg:pt-16">
          <div className="inline-flex h-12 items-center gap-2 rounded-pill border border-accent-brand px-5">
            <span
              className="size-2 shrink-0 rounded-full bg-accent-brand animate-pulse"
              aria-hidden
            />
            <span className="text-sm font-semibold leading-5 tracking-[-0.28px] text-accent-brand">
              {t("badge")}
            </span>
          </div>

          <h1 className="w-full max-w-content text-balance text-center font-display text-[clamp(1.75rem,5vw+0.5rem,2.75rem)] font-semibold leading-[100%] tracking-normal text-ink md:text-[62px]">
            {t("heroTitleBefore")}
            <span className="text-accent-brand">{t("heroTitleAccent")}</span>
            {t("heroTitleAfter")}
          </h1>

          <p className="max-w-[680px] font-sans text-xl font-semibold leading-[30px] tracking-[-0.4px] text-accent-brand">
            {t("subtitle")}
          </p>
        </section>

        {/* Book visual stage */}
        <section className="mt-12 flex w-full max-w-4xl flex-col items-center gap-10 px-2 md:mt-16 lg:mt-20 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="flex w-full flex-col items-center gap-7 lg:w-[122px] lg:shrink-0 lg:items-end lg:pt-12">
            <StatPill
              value="150"
              label={t("statUxPrinciples")}
              align="right"
              className="w-full max-w-[100px]"
            />
            <StatPill
              value="2"
              label={t("statLanguages")}
              align="right"
              className="w-full max-w-[79px]"
            />
            <StatPill
              value={<span className="text-base leading-none">∞</span>}
              label={t("statExamples")}
              align="right"
              className="w-full max-w-[110px]"
            />
          </div>

          <div className="relative flex flex-col items-center">
            <span className="absolute -top-1 right-2 z-10 rounded-md bg-accent-brand px-5 py-2 text-[10px] font-semibold leading-3 tracking-[-0.2px] text-white md:right-0 md:top-2">
              {t("coverTag")}
            </span>
            <div className="animate-book-cover-float shadow-book">
              <Image
                src="/images/book-cover-launch.png"
                alt={t("coverImageAlt")}
                width={218}
                height={299}
                className="h-auto w-[min(100%,218px)] rounded-sm"
                priority
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="rounded-pill border border-border-subtle bg-book-surface px-5 py-2 text-[10px] font-semibold leading-3 tracking-[-0.2px] text-brand-dark">
                {t("langEnglish")}
              </span>
              <span className="rounded-pill border border-border-subtle bg-book-surface px-5 py-2 text-[10px] font-semibold leading-3 tracking-[-0.2px] text-brand-dark">
                {t("langSinhala")}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-7 lg:w-[122px] lg:shrink-0 lg:items-start lg:pt-12">
            <StatPill
              value="1"
              label={t("statEmailLaunch")}
              align="left"
              className="w-full max-w-[100px]"
            />
            <StatPill
              value="Free"
              label={t("statEarlyAccess")}
              align="left"
              className="w-full max-w-[122px]"
            />
          </div>
        </section>

        {/* Notify card */}
        <section className="mt-14 flex w-full justify-center px-2 md:mt-20">
          <BookNotifyCard />
        </section>

        {/* Info strip */}
        <section
          className="relative left-1/2 mt-16 w-screen max-w-none -translate-x-1/2 border-y border-border-subtle bg-featured-strip py-4 text-center text-sm font-medium tracking-[-0.28px] text-brand-dark md:mt-20"
          aria-label={t("infoStrip")}
        >
          <p className="mx-auto max-w-page px-6">{t("infoStrip")}</p>
        </section>

        {/* Principle preview */}
        <section className="mt-16 w-full md:mt-24">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold leading-none text-ink md:text-4xl">
              {t("peekTitle")}
            </h2>
            <p className="text-sm font-semibold text-muted-text sm:text-base">
              {t("peekCount")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {first ? (
              <PrincipleCard
                title={first.title}
                description={first.description ?? ""}
                slug={first.slug}
                imageUrl={first.illustration_url ?? undefined}
                className="w-full max-w-none"
                section="book-peek"
                position={0}
                linkHref={`/principles/${first.slug}`}
              />
            ) : null}
            {second ? (
              <PrincipleCard
                title={second.title}
                description={second.description ?? ""}
                slug={second.slug}
                imageUrl={second.illustration_url ?? undefined}
                className="w-full max-w-none"
                section="book-peek"
                position={1}
                linkHref={`/principles/${second.slug}`}
              />
            ) : null}
            <BookLockedPrincipleCard
              title={t("teaserTitle")}
              description={t("teaserDescription")}
              badgeLabel={t("lockedBadge")}
              className="w-full"
            />
            <BookLockedPrincipleCard
              title={t("teaserTitle")}
              description={t("teaserDescription")}
              badgeLabel={t("lockedBadge")}
              className="w-full"
            />
          </div>
        </section>

        <section className="mt-20 w-full md:mt-24">
          <CommunitySection />
        </section>
      </main>
    </div>
  );
}
