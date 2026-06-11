"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authSubmitButtonClassName,
} from "@/components/auth/auth-form-styles";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type FormView = "sign_in" | "forgot_password";

type SignInFormProps = {
  onSwitchToSignUp: () => void;
  onResetPasswordSuccess?: () => void;
};

export function SignInForm({
  onSwitchToSignUp,
  onResetPasswordSuccess,
}: SignInFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [view, setView] = useState<FormView>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleBackToSignIn() {
    setView("sign_in");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(t("signInError"));
      setLoading(false);
      return;
    }

    const principlesPath =
      locale === "en" ? "/principles" : `/${locale}/principles`;
    router.push(principlesPath);
    router.refresh();
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(t("forgotPasswordEmailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(t("signUpErrorInvalidEmail"));
      return;
    }

    setResetLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      { redirectTo },
    );

    if (resetError) {
      setError(t("forgotPasswordError"));
      setResetLoading(false);
      return;
    }

    onResetPasswordSuccess?.();
    setResetLoading(false);
  }

  if (view === "forgot_password") {
    return (
      <form className="space-y-4" onSubmit={(e) => void handleResetSubmit(e)}>
        <div className="space-y-2 text-center">
          <h2 className="font-display text-xl font-semibold tracking-[-0.03em] text-ink md:text-2xl">
            {t("resetPasswordHeading")}
          </h2>
          <p className="text-sm text-muted-text md:text-base">
            {t("resetPasswordSubtext")}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-email" className={authLabelClassName}>
            {t("emailLabel")}
          </Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            required
            disabled={resetLoading}
            className={authInputClassName}
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={resetLoading}
          className={authSubmitButtonClassName}
        >
          {resetLoading ? t("sendResetLinkLoading") : t("sendResetLinkButton")}
        </button>

        <p className="text-center">
          <button
            type="button"
            onClick={handleBackToSignIn}
            disabled={resetLoading}
            className={authLinkClassName}
          >
            {t("backToSignIn")}
          </button>
        </p>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
      <div className="space-y-1.5">
        <Label htmlFor="sign-in-email" className={authLabelClassName}>
          {t("emailLabel")}
        </Label>
        <Input
          id="sign-in-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
          disabled={loading}
          className={authInputClassName}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sign-in-password" className={authLabelClassName}>
          {t("passwordLabel")}
        </Label>
        <PasswordInput
          id="sign-in-password"
          value={password}
          onChange={setPassword}
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={authSubmitButtonClassName}
      >
        {loading ? t("signInLoading") : t("signInButton")}
      </button>

      <div className="space-y-2 text-center">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setView("forgot_password");
          }}
          disabled={loading}
          className={authLinkClassName}
        >
          {t("forgotPassword")}
        </button>
        <p>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className={authLinkClassName}
          >
            {t("switchToSignUp")}
          </button>
        </p>
      </div>
    </form>
  );
}
