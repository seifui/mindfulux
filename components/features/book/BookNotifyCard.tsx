"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  trackBookEmailCtaClicked,
  trackBookNotifySubmitted,
} from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email.slice(at + 1).toLowerCase();
}

export function BookNotifyCard() {
  const t = useTranslations("book");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError(t("validationEmail"));
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/notify-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(t("notifyError"));
        setPending(false);
        return;
      }
      trackBookNotifySubmitted(emailDomain(trimmed));
      setSuccess(true);
    } catch {
      setError(t("notifyError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative w-full max-w-[540px] overflow-hidden rounded-3xl bg-book-surface px-2 pb-10 pt-px md:px-[7px] md:pb-[42px] md:pt-px">
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-accent-brand to-lavender"
        aria-hidden
      />
      <div className="flex flex-col items-center gap-4 pt-8 md:gap-[17px] md:pt-10">
        <h2 className="w-full text-center text-2xl font-semibold leading-8 tracking-[-0.48px] text-ink">
          {t("notifyHeading")}
        </h2>
        <p className="max-w-md text-center text-lg font-medium leading-7 tracking-[-0.36px] text-accent-brand">
          {t("notifySubtext")}
        </p>

        {success ? (
          <p
            className="pt-2 text-center text-lg font-semibold text-accent-brand"
            role="status"
          >
            {t("successMessage")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6"
          >
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
              className="h-[60px] w-full max-w-[299px] rounded-pill border-0 bg-input-fill pl-6 pr-3 text-base font-medium text-ink placeholder:text-muted-text focus-visible:ring-0 focus-visible:ring-offset-0 sm:shrink-0"
            />
            <Button
              type="submit"
              disabled={pending}
              className="h-12 shrink-0 rounded-lg bg-accent-brand px-5 text-sm font-semibold text-white hover:bg-accent-brand/90"
            >
              {t("notifyCta")}
            </Button>
          </form>
        )}

        {error ? (
          <p className="text-center font-sans text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <p className="text-center text-sm font-medium text-muted-text">
          {t("notifyDirectPrefix")}{" "}
          <a
            href="mailto:book@mindfulux.com"
            className="text-accent-brand underline-offset-2 hover:underline"
            onClick={() => trackBookEmailCtaClicked()}
          >
            book@mindfulux.com
          </a>
        </p>
      </div>
    </div>
  );
}
