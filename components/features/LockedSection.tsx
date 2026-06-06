import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { UserTier } from "@/lib/access";
import { TOTAL_PRINCIPLES, getPrincipleLimit } from "@/lib/access";

type LockedSectionProps = {
  userTier: UserTier;
};

function BlurredPlaceholderCard({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-skill border border-border-subtle bg-card"
    >
      <div className="aspect-[4/3] w-full bg-border-subtle/60 blur-sm" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-5 w-3/4 rounded bg-border-subtle/80 blur-sm" />
        <div className="h-3 w-full rounded bg-border-subtle/60 blur-sm" />
        <div className="h-3 w-5/6 rounded bg-border-subtle/60 blur-sm" />
        <span className="sr-only">Locked principle placeholder {index}</span>
      </div>
    </div>
  );
}

export async function LockedSection({ userTier }: LockedSectionProps) {
  const t = await getTranslations("access");
  const visibleLimit = getPrincipleLimit(userTier);

  if (userTier !== 1 || visibleLimit >= TOTAL_PRINCIPLES) {
    return null;
  }

  return (
    <section className="mt-16 flex w-full flex-col items-center gap-8">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <BlurredPlaceholderCard key={i} index={i} />
        ))}
      </div>

      <div className="flex max-w-lg flex-col items-center gap-3 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
          {t("lockedTitle")}
        </h2>
        <p className="text-sm text-muted-text">{t("lockedSubtext")}</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center rounded-pill bg-accent-brand px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("lockedCta")}
        </Link>
      </div>
    </section>
  );
}
