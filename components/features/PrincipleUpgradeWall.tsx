import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getImageUrl } from "@/lib/cloudflare-images";
import type { PrincipleTeaser } from "@/lib/principles";

import defaultPrincipleHero from "../../public/illustrations/centre-stage-effect-detail.png";

const DETAIL_HERO_FALLBACK_PATH =
  "/illustrations/centre-stage-effect-detail.png";

function principleHeroSrc(
  illustrationUrl: string | null | undefined,
): string | StaticImageData {
  const t = illustrationUrl?.trim();
  if (!t || t.toLowerCase() === "null") return defaultPrincipleHero;
  return getImageUrl(t, { fallback: DETAIL_HERO_FALLBACK_PATH });
}

type PrincipleUpgradeWallProps = {
  principle: PrincipleTeaser;
};

export async function PrincipleUpgradeWall({
  principle,
}: PrincipleUpgradeWallProps) {
  const t = await getTranslations("access");

  return (
    <div className="flex flex-col">
      <h1 className="mb-8 mt-6 font-display text-detail-title font-semibold leading-none text-ink">
        {principle.title}
      </h1>

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

      {principle.category && (
        <span className="mb-4 inline-flex w-fit rounded-pill border border-border-subtle px-3 py-1 text-xs font-medium text-muted-text">
          {principle.category}
        </span>
      )}

      <p className="mb-8 select-none font-sans text-detail-tagline font-medium text-ink-secondary blur-sm">
        {principle.description ??
          "Sign in to read the full description."}
      </p>

      <div className="rounded-card border border-border-subtle bg-card p-8 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
          {t("upgradeWallTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-text">
          {t("upgradeWallDescription")}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center rounded-pill bg-accent-brand px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("lockedCta")}
        </Link>
      </div>
    </div>
  );
}
