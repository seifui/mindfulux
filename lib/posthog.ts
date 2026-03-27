import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/api/posthog-proxy",
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    session_recording: { maskAllInputs: false },
    disable_session_recording: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  });
}

export default posthog;
