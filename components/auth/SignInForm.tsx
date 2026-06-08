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

type SignInFormProps = {
  onSwitchToSignUp: () => void;
};

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);

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

  async function handleForgotPassword() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(t("forgotPasswordEmailRequired"));
      return;
    }

    setResetLoading(true);
    setError(null);
    setResetMessage(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/settings")}`;
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

    setResetMessage(t("forgotPasswordSuccess"));
    setResetLoading(false);
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
          disabled={loading || resetLoading}
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
          disabled={loading || resetLoading}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {resetMessage ? (
        <p className="text-sm text-ink" role="status">
          {resetMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || resetLoading}
        className={authSubmitButtonClassName}
      >
        {loading ? t("signInLoading") : t("signInButton")}
      </button>

      <div className="space-y-2 text-center">
        <button
          type="button"
          onClick={() => void handleForgotPassword()}
          disabled={loading || resetLoading}
          className={authLinkClassName}
        >
          {resetLoading ? t("forgotPasswordLoading") : t("forgotPassword")}
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
