"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/features/SignUpForm";

type AuthView = "sign_in" | "sign_up";

export function LoginAuthForm() {
  const t = useTranslations("auth");
  const [view, setView] = useState<AuthView>("sign_in");

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

      {view === "sign_in" ? (
        <SignInForm onSwitchToSignUp={() => setView("sign_up")} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setView("sign_in")} />
      )}
    </div>
  );
}
