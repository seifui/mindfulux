"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AuthCodeRedirect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/auth/callback")) {
      return;
    }

    const code = searchParams.get("code");
    if (!code) {
      return;
    }

    const next = searchParams.get("next") ?? "/reset-password";
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("code", code);
    callbackUrl.searchParams.set("next", next);
    window.location.replace(callbackUrl.toString());
  }, [pathname, searchParams]);

  return null;
}
