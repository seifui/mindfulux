import type { Metadata } from "next";
import type { ComponentProps } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BookNotifyCard } from "@/components/features/book/BookNotifyCard";
import { CommunitySection } from "@/components/features/CommunitySection";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
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
  ...props
}: {
  value: React.ReactNode;
  label: string;
  align: "left" | "right" | "center";
  className?: string;
} & Omit<ComponentProps<"div">, "className" | "children">) {
  return (
    <div
      className={cn(
        "flex h-[47px] min-w-[4.75rem] flex-col justify-center rounded-md bg-book-surface px-2 py-3.5",
        align === "right"
          ? "items-end text-right"
          : align === "center"
            ? "items-center text-center"
            : "items-start text-left",
        className
      )}
      {...props}
    >
      <span className="text-xs font-semibold leading-[18px] tracking-[-0.24px] text-brand-dark">
        {value}
      </span>
      <span className="text-[10px] font-medium leading-3 tracking-[-0.2px] text-accent-brand">
        {label}
      </span>
    </div>
  );
}

function StatExamplesPill({
  label,
  className,
  ...props
}: { label: string; className?: string } & Omit<
  ComponentProps<"div">,
  "className" | "children"
>) {
  return (
    <div
      className={cn(
        "flex h-[47px] w-[min(100%,110px)] min-w-[6.5rem] flex-col items-end justify-center gap-0.5 rounded-md bg-book-surface px-2 py-3.5",
        className
      )}
      {...props}
    >
      <RefreshCw
        className="size-3.5 shrink-0 text-brand-dark"
        aria-hidden
        strokeWidth={2}
      />
      <span className="text-right text-[10px] font-medium leading-3 tracking-[-0.2px] text-accent-brand">
        {label}
      </span>
    </div>
  );
}

export default async function BookPage() {
  await captureBookPageViewed();
  const t = await getTranslations("book");

  return (
    <div className="flex min-h-full flex-col bg-cream font-sans text-ink dark:bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center pb-20">
        <div className="mx-auto w-full max-w-page px-6 lg:px-10">
          <section className="mx-auto flex w-full max-w-[680px] flex-col items-center gap-8 pt-10 text-center md:gap-[52px] md:pt-14 lg:pt-16">
            <div className="inline-flex h-12 w-[184px] max-w-full items-center justify-center gap-2 rounded-pill border border-accent-brand px-5">
              <span
                className="size-2 shrink-0 rounded-full bg-accent-brand animate-pulse"
                aria-hidden
              />
              <span className="text-sm font-semibold leading-5 tracking-[-0.28px] text-accent-brand">
                {t("badge")}
              </span>
            </div>

            <div className="flex w-full flex-col gap-5">
              <h1 className="w-full text-balance text-center font-display text-[clamp(1.75rem,5vw+0.5rem,3.875rem)] font-semibold leading-none tracking-normal md:text-[62px]">
                <span className="text-ink">{t("heroTitlePrefix")}</span>
                <span className="text-accent-brand">{t("heroTitleAccentPart")}</span>
                <span className="text-ink">{t("heroTitleInkPart")}</span>
              </h1>

              <p className="font-sans text-xl font-semibold leading-[30px] tracking-[-0.4px] text-accent-brand">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="animate-book-cover-float shadow-none">
                <Image
                  src="/images/book-cover-launch.png"
                  alt={t("coverImageAlt")}
                  width={900}
                  height={1660}
                  className="h-auto w-[min(100%,163px)] rounded-sm shadow-none ring-0"
                  priority
                />
              </div>
            </div>

            <div
              className="flex w-full flex-wrap justify-center gap-2 sm:justify-between sm:gap-2"
              role="list"
              aria-label={t("statsRowLabel")}
            >
              <StatPill
                role="listitem"
                value="150"
                label={t("statUxPrinciples")}
                align="right"
                className="w-[calc(50%-0.25rem)] max-w-[79px] sm:w-[79px] sm:shrink-0"
              />
              <StatPill
                role="listitem"
                value="2"
                label={t("statLanguages")}
                align="right"
                className="w-[calc(50%-0.25rem)] max-w-[79px] sm:w-[79px] sm:shrink-0"
              />
              <StatExamplesPill
                role="listitem"
                label={t("statExamples")}
                className="w-[calc(50%-0.25rem)] sm:w-[110px] sm:shrink-0"
              />
              <StatPill
                role="listitem"
                value="1"
                label={t("statEmailLaunch")}
                align="right"
                className="w-[calc(50%-0.25rem)] max-w-[100px] sm:w-[100px] sm:shrink-0"
              />
              <StatPill
                role="listitem"
                value="Free"
                label={t("statEarlyAccess")}
                align="right"
                className="w-[calc(50%-0.25rem)] max-w-[122px] sm:w-[122px] sm:shrink-0"
              />
            </div>
          </section>

          <section className="mt-14 flex w-full justify-center md:mt-[49px]">
            <BookNotifyCard />
          </section>
        </div>

        <section className="mt-16 w-full md:mt-20">
          <CommunitySection />
        </section>
      </main>
    </div>
  );
}
