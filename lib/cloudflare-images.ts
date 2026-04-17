const DEFAULT_CARD_FALLBACK = "/illustrations/centre-stage-effect.png";

/**
 * Resolves a value from `principles.illustration_url` for use in `next/image`.
 * - Cloudflare Images ID → `https://imagedelivery.net/{hash}/{id}/{variant}` (needs `NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH`)
 * - Absolute URLs and app paths (`/illustrations/...`) pass through unchanged
 */
export function getImageUrl(
  ref: string | null | undefined,
  options?: { variant?: string; fallback?: string }
): string {
  const fallback = options?.fallback ?? DEFAULT_CARD_FALLBACK;
  const variant = options?.variant ?? "public";
  const t = ref?.trim() ?? "";
  if (!t || t.toLowerCase() === "null") return fallback;

  const lower = t.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;

  const hash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH?.trim();
  if (!hash) return fallback;

  return `https://imagedelivery.net/${hash}/${t}/${variant}`;
}
