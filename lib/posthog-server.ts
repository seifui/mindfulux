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
