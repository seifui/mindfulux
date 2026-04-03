import { PostHog } from "posthog-node";

let client: PostHog | undefined;

export function getPostHogClient(): PostHog | undefined {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return undefined;
  if (!client) {
    client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

/** Server-rendered book landing — aggregate-friendly distinct id */
export async function captureBookPageViewed(): Promise<void> {
  const ph = getPostHogClient();
  if (!ph) return;
  await ph.captureImmediate({
    distinctId: "anonymous_book_landing",
    event: "book_page_viewed",
  });
}
