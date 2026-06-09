"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { authLinkClassName } from "@/components/auth/auth-form-styles";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/features/SignUpForm";

type AuthView = "sign_in" | "sign_up";

function SignUpSuccessCard({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const t = useTranslations("auth");

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col items-center gap-4 rounded-card border border-border-subtle bg-card p-6 text-center md:gap-5 md:p-8"
        role="status"
      >
        <div className="flex size-12 items-center justify-center rounded-full border border-border-subtle bg-card-fill md:size-14">
          <Mail
            className="size-6 text-accent md:size-7"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-ink md:text-2xl">
            {t("signUpSuccessHeading")}
          </h2>
          <p className="text-sm text-muted-text md:text-base">
            {t("signUpSuccessSubtext")}
          </p>
        </div>
      </div>

      <p className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className={authLinkClassName}
        >
          {t("switchToSignIn")}
        </button>
      </p>
    </div>
  );
}

export function LoginAuthForm() {
  const t = useTranslations("auth");
  const [view, setView] = useState<AuthView>("sign_in");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  function handleSwitchToSignIn() {
    setSignUpSuccess(false);
    setView("sign_in");
  }

  function handleSwitchToSignUp() {
    setSignUpSuccess(false);
    setView("sign_up");
  }

  if (signUpSuccess) {
    return <SignUpSuccessCard onSwitchToSignIn={handleSwitchToSignIn} />;
  }

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
        <SignInForm onSwitchToSignUp={handleSwitchToSignUp} />
      ) : (
        <SignUpForm
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUpSuccess={() => setSignUpSuccess(true)}
        />
      )}
    </div>
  );
}
