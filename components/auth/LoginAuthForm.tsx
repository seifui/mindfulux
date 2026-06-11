"use client";

import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

function ResetPasswordSuccessCard({
  onBackToSignIn,
}: {
  onBackToSignIn: () => void;
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
            {t("resetPasswordSuccessHeading")}
          </h2>
          <p className="text-sm text-muted-text md:text-base">
            {t("resetPasswordSuccessSubtext")}
          </p>
        </div>
      </div>

      <p className="text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className={authLinkClassName}
        >
          {t("backToSignIn")}
        </button>
      </p>
    </div>
  );
}

export function LoginAuthForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const [view, setView] = useState<AuthView>("sign_in");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    // Check query params first
    if (errorCode === "otp_expired") {
      setUrlError(t("authErrorOtpExpired"));
      return;
    }

    // Also check hash fragment (Supabase sometimes puts errors there)
    const hash = window.location.hash;
    if (hash.includes("error_code=otp_expired")) {
      setUrlError(t("authErrorOtpExpired"));
    } else if (
      hash.includes("error=access_denied") ||
      hash.includes("auth_callback_failed")
    ) {
      setUrlError(t("authErrorCallbackFailed"));
    }
  }, [errorCode]);

  function handleSwitchToSignIn() {
    setSignUpSuccess(false);
    setResetPasswordSuccess(false);
    setView("sign_in");
  }

  function handleSwitchToSignUp() {
    setSignUpSuccess(false);
    setResetPasswordSuccess(false);
    setView("sign_up");
  }

  function handleBackToSignInFromReset() {
    setResetPasswordSuccess(false);
    setView("sign_in");
  }

  if (signUpSuccess) {
    return <SignUpSuccessCard onSwitchToSignIn={handleSwitchToSignIn} />;
  }

  if (resetPasswordSuccess) {
    return (
      <ResetPasswordSuccessCard onBackToSignIn={handleBackToSignInFromReset} />
    );
  }

  return (
    <div className="space-y-6">
      {urlError ? (
        <p className="text-sm text-destructive text-center" role="alert">
          {urlError}
        </p>
      ) : null}

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
        <SignInForm
          onSwitchToSignUp={handleSwitchToSignUp}
          onResetPasswordSuccess={() => setResetPasswordSuccess(true)}
        />
      ) : (
        <SignUpForm
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUpSuccess={() => setSignUpSuccess(true)}
        />
      )}
    </div>
  );
}
