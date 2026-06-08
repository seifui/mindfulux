"use client";

import posthog from "posthog-js";
import { useState } from "react";

import {
  authInputClassName,
  authLabelClassName,
  authSubmitButtonClassName,
} from "@/components/auth/auth-form-styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ComingSoonForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nameTrim = name.trim();
    const emailTrim = email.trim();

    if (!nameTrim || !emailTrim || !isValidEmail(emailTrim)) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameTrim, email: emailTrim }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        posthog.capture("newsletter_subscribed", { source: "coming_soon" });
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
      <p className="text-center text-base font-medium text-ink" role="status">
        You&apos;re on the list! We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
      <h2 className="text-center font-display text-xl font-semibold text-ink">
        Be the first to know when we launch
      </h2>

      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="coming-soon-name" className={authLabelClassName}>
            First name
          </Label>
          <Input
            id="coming-soon-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            required
            disabled={loading}
            className={authInputClassName}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coming-soon-email" className={authLabelClassName}>
            Email
          </Label>
          <Input
            id="coming-soon-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            disabled={loading}
            className={authInputClassName}
          />
        </div>
      </div>

      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className={authSubmitButtonClassName}
      >
        {loading ? "Submitting..." : "Notify me"}
      </Button>
    </form>
  );
}
