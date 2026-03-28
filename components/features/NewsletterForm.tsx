"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up newsletter submission
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[415px] flex-col gap-[35px]"
    >
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                     text-base font-medium text-ink placeholder:text-muted-text
                     focus-visible:ring-0 focus-visible:ring-offset-0
                     focus-visible:border-transparent dark:bg-input-fill"
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="h-[60px] rounded-pill border-0 bg-input-fill pl-6 pr-3 py-3
                     text-base font-medium text-ink placeholder:text-muted-text
                     focus-visible:ring-0 focus-visible:ring-offset-0
                     focus-visible:border-transparent dark:bg-input-fill"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-pill bg-accent-brand px-5 py-[14px]
                   text-base font-semibold text-white
                   transition-opacity duration-150 hover:opacity-90"
      >
        Join the Community
      </button>
    </form>
  );
}
