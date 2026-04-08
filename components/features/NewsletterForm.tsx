"use client";

import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const t = useTranslations("community");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        posthog.capture("newsletter_subscribed", { source: "community_form" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex w-full max-w-[415px] flex-col gap-[35px]">
        <p className="text-center text-base font-medium text-ink">
          You're in! Welcome to the MindfulUX community 🎉
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[415px] flex-col gap-[35px]"
    >
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          disabled={loading}
          className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                     text-base font-medium text-ink placeholder:text-muted-text
                     focus-visible:ring-0 focus-visible:ring-offset-0
                     focus-visible:border-transparent dark:bg-input-fill"
        />
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                     text-base font-medium text-ink placeholder:text-muted-text
                     focus-visible:ring-0 focus-visible:ring-offset-0
                     focus-visible:border-transparent dark:bg-input-fill"
        />
      </div>
      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-accent-brand px-5 py-[14px]
                   text-base font-semibold text-white
                   transition-opacity duration-150 hover:opacity-90"
      >
        {loading ? "Joining..." : t("submit")}
      </button>
    </form>
  );
}
