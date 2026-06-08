import { LogoMark } from "@/components/brand/LogoMark";

import { ComingSoonForm } from "./ComingSoonForm";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-6 py-10">
      <header className="flex items-center gap-3">
        <LogoMark />
        <span className="font-display text-logo font-semibold text-foreground">
          MindfulUX Growth
        </span>
      </header>

      <main className="flex w-full max-w-teaser flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-2xl font-semibold text-ink">
            150 UX Psychology Principles for Better Design
          </h1>
          <p className="text-base text-muted-text">
            A curated library of psychology principles to help designers and
            product teams make smarter, more human-centred decisions.
          </p>
        </div>

        <ComingSoonForm />
      </main>

      <footer className="flex w-full max-w-teaser items-center justify-between">
        <p className="text-sm text-muted-text">
          &copy; 2025 MindfulUX Growth
        </p>
      </footer>
    </div>
  );
}
