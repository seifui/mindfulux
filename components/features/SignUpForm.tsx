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
import { createClient } from "@/lib/supabase/client";

type SignUpFormProps = {
  onSwitchToSignIn: () => void;
};

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const principlesPath =
      locale === "en" ? "/principles" : `/${locale}/principles`;
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(principlesPath)}`;

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo },
    });

    if (signUpError) {
      setError(t("signUpError"));
      setLoading(false);
      return;
    }

    setSuccess(true);
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
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
          onChange={setPassword}
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
          onChange={setConfirmPassword}
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

      {success ? (
        <p className="text-sm text-ink" role="status">
          {t("signUpSuccess")}
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
