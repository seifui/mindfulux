"use client";

import { Menu } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { type ReactNode, useState } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/principles", label: "Principles" },
] as const;

function MainNavLinks({
  className,
  onItemClick,
}: {
  className?: string;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center justify-end gap-3 sm:gap-6 md:gap-8",
        className,
      )}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href ||
              pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "font-sans text-sm font-medium text-ink transition-colors hover:text-accent-brand sm:text-base",
              isActive && "text-accent-brand",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function LocaleSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "si" : "en";

  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        router.replace(pathname, { locale: nextLocale });
      }}
      className="cursor-pointer border-0 bg-transparent p-0 font-sans text-base font-medium text-ink transition-colors hover:text-accent-brand"
      aria-label={
        nextLocale === "si" ? "Switch to Sinhala" : "Switch to English"
      }
    >
      {nextLocale === "si" ? "සිංහල" : "English"}
    </button>
  );
}

type NavbarClientProps = {
  authActions: ReactNode;
  userMenu: ReactNode;
};

export function NavbarClient({ authActions, userMenu }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="relative left-1/2 flex w-screen -translate-x-1/2 items-center justify-between gap-4 overflow-x-clip bg-background px-6 py-4 md:gap-8 md:py-5 lg:px-10"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3"
      >
        <LogoMark />
        <span className="whitespace-nowrap font-display text-[clamp(1.1rem,4vw,1.806rem)] font-semibold leading-none tracking-[-0.03em] text-foreground">
          MindfulUX Growth
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-8">
        <MainNavLinks className="hidden md:flex" />
        <div className="hidden md:flex">{authActions}</div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
          <ThemeToggle />
          {userMenu}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-2 text-ink md:hidden"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="size-6" strokeWidth={2} aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8 px-1 pt-2">
                <MainNavLinks
                  className="flex-col items-start justify-start gap-4"
                  onItemClick={() => setMobileMenuOpen(false)}
                />
                <div onClick={() => setMobileMenuOpen(false)}>{authActions}</div>
                <LocaleSwitcher
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
