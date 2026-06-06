"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useLocale, useTranslations } from "next-intl";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { createClient } from "@/lib/supabase/client";

export function LoginAuthForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const supabase = createClient();
  const principlesPath =
    locale === "en" ? "/principles" : `/${locale}/principles`;
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(principlesPath)}`
      : undefined;

  return (
    <div className="space-y-6">
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-card px-3 text-muted-text">{t("orDivider")}</span>
        </div>
      </div>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#B68973",
                brandAccent: "#9a755f",
                brandButtonText: "white",
                defaultButtonBackground: "#B68973",
                defaultButtonBackgroundHover: "#9a755f",
              },
              radii: {
                borderRadiusButton: "9999px",
                buttonBorderRadius: "9999px",
                inputBorderRadius: "9999px",
              },
            },
          },
          className: {
            container: "font-sans",
            button: "font-medium",
            label: "text-ink",
            input: "bg-background text-ink border-border-subtle",
          },
        }}
        providers={[]}
        redirectTo={redirectTo}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              password_label: "Password",
              button_label: "Sign in",
              loading_button_label: "Signing in…",
              link_text: "Already have an account? Sign in",
            },
            sign_up: {
              email_label: "Email",
              password_label: "Password",
              button_label: "Sign up",
              loading_button_label: "Signing up…",
              link_text: "Don't have an account? Sign up",
            },
          },
        }}
      />
    </div>
  );
}
