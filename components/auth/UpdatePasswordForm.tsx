"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AuthError } from "@supabase/supabase-js";

import {
  authLabelClassName,
  authLinkClassName,
  authSubmitButtonClassName,
} from "@/components/auth/auth-form-styles";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const SESSION_TIMEOUT_MS = 5000;

function mapUpdatePasswordError(
  updateError: AuthError,
  t: ReturnType<typeof useTranslations<"auth">>,
): string {
  if (process.env.NODE_ENV === "development") {
    console.error("[UpdatePasswordForm]", updateError.code, updateError.message);
  }

  switch (updateError.code) {
    case "weak_password":
      return t("updatePasswordWeakError");
    case "same_password":
      return t("updatePasswordSameError");
    case "session_not_found":
    case "refresh_token_not_found":
      return t("updatePasswordSessionExpired");
    default:
      if (
        updateError.message.toLowerCase().includes("session") ||
        updateError.message.toLowerCase().includes("not authenticated")
      ) {
        return t("updatePasswordSessionExpired");
      }
      return t("updatePasswordError");
  }
}

export function UpdatePasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    const supabase = createClient();
    let ready = false;

    const markReady = () => {
      ready = true;
      setSessionReady(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        markReady();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "PASSWORD_RECOVERY")
      ) {
        markReady();
      }
    });

    const timeoutId = window.setTimeout(() => {
      if (!ready) {
        setSessionExpired(true);
      }
    }, SESSION_TIMEOUT_MS);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionReady || password !== confirmPassword) {
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(mapUpdatePasswordError(updateError, t));
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();

    setSuccess(true);
    setLoading(false);
    window.setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 2000);
  }

  if (success) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-card border border-border-subtle bg-card p-6 text-center md:gap-5 md:p-8"
        role="status"
      >
        <div className="flex size-12 items-center justify-center rounded-full border border-border-subtle bg-card-fill md:size-14">
          <CheckCircle2
            className="size-6 text-accent md:size-7"
            aria-hidden="true"
          />
        </div>
        <p className="text-sm text-muted-text md:text-base">
          {t("updatePasswordSuccess")}
        </p>
      </div>
    );
  }

  if (sessionExpired && !sessionReady) {
    return (
      <div className="space-y-4 text-center" role="alert">
        <p className="text-sm text-destructive">{t("resetPasswordExpired")}</p>
        <Link href="/login" className={authLinkClassName}>
          {t("backToSignIn")}
        </Link>
      </div>
    );
  }

  const formDisabled = loading || !sessionReady;

  return (
    <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
      {!sessionReady ? (
        <p className="text-center text-sm text-muted-text" role="status">
          {t("resetPasswordPreparing")}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="new-password" className={authLabelClassName}>
          {t("newPasswordLabel")}
        </Label>
        <PasswordInput
          id="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError(null);
          }}
          placeholder={t("newPasswordPlaceholder")}
          autoComplete="new-password"
          disabled={formDisabled}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm-new-password" className={authLabelClassName}>
          {t("confirmPasswordLabel")}
        </Label>
        <PasswordInput
          id="confirm-new-password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setError(null);
          }}
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
          disabled={formDisabled}
          aria-invalid={passwordsMismatch}
        />
        {passwordsMismatch ? (
          <p className="text-sm text-destructive" role="alert">
            {t("passwordsDoNotMatch")}
          </p>
        ) : null}
      </div>

      {error && !passwordsMismatch ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={formDisabled || passwordsMismatch}
        className={authSubmitButtonClassName}
      >
        {loading ? t("updatePasswordLoading") : t("updatePasswordButton")}
      </button>
    </form>
  );
}
