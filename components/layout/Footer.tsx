import Link from "next/link";

export function Footer() {
  return (
    <footer>
      {/* ── Footer bottom bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-t border-border-subtle py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-sm text-muted-text">
          © 2025 MindfulUX Growth. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="font-sans text-sm text-muted-text transition-colors hover:text-ink"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="font-sans text-sm text-muted-text transition-colors hover:text-ink"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
