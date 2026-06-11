"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AuthError } from "@supabase/supabase-js";

import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authSubmitButtonClassName,
} from "@/components/auth/auth-form-styles";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mapSignUpError(
  signUpError: AuthError,
  t: ReturnType<typeof useTranslations<"auth">>,
): string {
  if (process.env.NODE_ENV === "development") {
    console.error("[SignUpForm]", signUpError.code, signUpError.message);
  }

  switch (signUpError.code) {
    case "weak_password":
      return t("signUpErrorWeakPassword");
    case "invalid_email":
      return t("signUpErrorInvalidEmail");
    default:
      return t("signUpError");
  }
}

type SignUpFormProps = {
  onSwitchToSignIn: () => void;
  onSignUpSuccess?: () => void;
};

export function SignUpForm({ onSwitchToSignIn, onSignUpSuccess }: SignUpFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  function handleEmailChange(value: string) {
    setEmail(value);
    setError(null);
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setError(null);
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(t("signUpErrorEmailRequired"));
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError(t("signUpErrorInvalidEmail"));
      return;
    }

    if (!password) {
      setError(t("signUpErrorPasswordRequired"));
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("signUpErrorWeakPassword"));
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    setError(null);

    const principlesPath =
      locale === "en" ? "/principles" : `/${locale}/principles`;
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(principlesPath)}`;

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { emailRedirectTo },
    });

    if (signUpError) {
      setError(mapSignUpError(signUpError, t));
      setLoading(false);
      return;
    }

    onSignUpSuccess?.();
    setLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
      <div className="space-y-1.5">
        <Label htmlFor="sign-up-email" className={authLabelClassName}>
          {t("emailLabel")}
        </Label>
        <Input
          id="sign-up-email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          disabled={loading}
          className={authInputClassName}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sign-up-password" className={authLabelClassName}>
          {t("passwordLabel")}
        </Label>
        <PasswordInput
          id="sign-up-password"
          value={password}
          onChange={handlePasswordChange}
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sign-up-confirm-password" className={authLabelClassName}>
          {t("confirmPasswordLabel")}
        </Label>
        <PasswordInput
          id="sign-up-confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
          disabled={loading}
          aria-invalid={passwordsMismatch}
        />
        {passwordsMismatch ? (
          <p className="text-sm text-destructive" role="alert">
            {t("passwordsDoNotMatch")}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || passwordsMismatch}
        className={authSubmitButtonClassName}
      >
        {loading ? t("signUpLoading") : t("signUpButton")}
      </button>

      <p className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className={authLinkClassName}
        >
          {t("switchToSignIn")}
        </button>
      </p>
    </form>
  );
}
