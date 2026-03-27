import posthog from "posthog-js";

function canTrack(): boolean {
  return typeof window !== "undefined" && !!posthog.__loaded;
}

export function trackPrincipleViewed(
  slug: string,
  category: string,
  locale: "en" | "si"
) {
  if (!canTrack()) return;
  posthog.capture("principle_viewed", { slug, category, locale });
}

export function trackPrincipleCardClicked(
  slug: string,
  position: number,
  section: string
) {
  if (!canTrack()) return;
  posthog.capture("principle_card_clicked", { slug, position, section });
}

export function trackSearchPerformed(query: string, resultCount: number) {
  if (!canTrack()) return;
  posthog.capture("search_performed", { query, result_count: resultCount });
}

export function trackFilterApplied(filterType: string, value: string) {
  if (!canTrack()) return;
  posthog.capture("filter_applied", { filter_type: filterType, value });
}

export function trackSortChanged(sortValue: string) {
  if (!canTrack()) return;
  posthog.capture("sort_changed", { sort_value: sortValue });
}

export function trackLocaleSwitch(from: "en" | "si", to: "en" | "si") {
  if (!canTrack()) return;
  posthog.capture("locale_switched", { from, to });
}

export function trackThemeToggled(theme: "light" | "dark") {
  if (!canTrack()) return;
  posthog.capture("theme_toggled", { theme });
}

export function trackNewsletterSubscribed(source: string) {
  if (!canTrack()) return;
  posthog.capture("newsletter_subscribed", { source });
}

export function trackBookCTAClicked(location: string) {
  if (!canTrack()) return;
  posthog.capture("book_cta_clicked", { location });
}

export function trackCommunityCTAClicked(location: string) {
  if (!canTrack()) return;
  posthog.capture("community_cta_clicked", { location });
}

export function trackUpgradeClicked(source: string) {
  if (!canTrack()) return;
  posthog.capture("upgrade_clicked", { source });
}

export function trackBookmarkToggled(slug: string, action: "add" | "remove") {
  if (!canTrack()) return;
  posthog.capture("bookmark_toggled", { slug, action });
}
