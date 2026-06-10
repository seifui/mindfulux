import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    callbackUrl.searchParams.set("code", code);
    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", "/reset-password");
    }
    return NextResponse.redirect(callbackUrl);
  }

  const supabaseResponse = await updateSession(request);
  const intlResponse = intlMiddleware(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    });
  });

  return intlResponse;
}

export const config = {
  // Exclude /auth so next-intl does not rewrite /auth/callback → /en/auth/callback (404).
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
