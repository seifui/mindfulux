"use client";

import { useTranslations } from "next-intl";

import { NewsletterForm } from "@/components/features/NewsletterForm";

export function CommunitySection() {
  const t = useTranslations("community");

  return (
    <section id="community" className="w-full scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto flex max-w-page flex-col items-center gap-[35px] px-6">
        <h2 className="max-w-full text-center font-display text-[36px] font-semibold leading-none text-ink">
          {t("headingLine1")}
          <br />
          {t("headingLine2")}
        </h2>
        <NewsletterForm />
      </div>
    </section>
  );
}
