"use client";

import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useState } from "react";

import { Input } from "@/components/ui/input";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NewsletterForm() {
  const t = useTranslations("community");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateFields(): boolean {
    const nameTrim = name.trim();
    const emailTrim = email.trim();
    let nameErr: string | null = null;
    let emailErr: string | null = null;

    if (!nameTrim) {
      nameErr = "Please enter your name";
    } else if (nameTrim.length < 2) {
      nameErr = "Name must be at least 2 characters";
    }

    if (!emailTrim) {
      emailErr = "Please enter your email";
    } else if (!isValidEmail(emailTrim)) {
      emailErr = "Please enter a valid email address";
    }

    setNameError(nameErr);
    setEmailError(emailErr);
    return nameErr === null && emailErr === null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateFields()) return;
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
        setNameError(null);
        setEmailError(null);
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
        <div className="flex flex-col">
          <Input
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            autoComplete="given-name"
            disabled={loading}
            className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                       text-base font-medium text-ink placeholder:text-muted-text
                       focus-visible:ring-0 focus-visible:ring-offset-0
                       focus-visible:border-transparent dark:bg-input-fill"
          />
          {nameError ? (
            <p className="mt-1 text-left text-sm text-destructive">{nameError}</p>
          ) : null}
        </div>
        <div className="flex flex-col">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            autoComplete="email"
            disabled={loading}
            className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                       text-base font-medium text-ink placeholder:text-muted-text
                       focus-visible:ring-0 focus-visible:ring-offset-0
                       focus-visible:border-transparent dark:bg-input-fill"
          />
          {emailError ? (
            <p className="mt-1 text-left text-sm text-destructive">{emailError}</p>
          ) : null}
        </div>
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
