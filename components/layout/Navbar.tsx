"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  { href: "/#community", label: "Community" },
  { href: "/book", label: "Book" },
] as const;

function LogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-9 shrink-0 md:size-10"
      aria-hidden
    >
      <g clipPath="url(#clip0_4566_1399)">
        <path
          d="M0 10.0428H10.0322L5.01609 -0.000244141L0 10.0428Z"
          fill="#4F4040"
        />
      </g>
      <g clipPath="url(#clip1_4566_1399)">
        <path
          d="M23.2001 -0.000106812H13.168V10.043H23.2001V-0.000106812Z"
          fill="#B68973"
        />
      </g>
      <g clipPath="url(#clip2_4566_1399)">
        <path
          d="M10.0322 13.1793H0V23.2224H10.0322V13.1793Z"
          fill="#B68973"
        />
      </g>
      <g clipPath="url(#clip3_4566_1399)">
        <path
          d="M18.1841 23.2224C20.9544 23.2224 23.2001 20.9742 23.2001 18.2008C23.2001 15.4275 20.9544 13.1793 18.1841 13.1793C15.4137 13.1793 13.168 15.4275 13.168 18.2008C13.168 20.9742 15.4137 23.2224 18.1841 23.2224Z"
          fill="#B68973"
        />
      </g>
      <defs>
        <clipPath id="clip0_4566_1399">
          <rect width="10.0322" height="10.0431" fill="white" />
        </clipPath>
        <clipPath id="clip1_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(13.168)"
          />
        </clipPath>
        <clipPath id="clip2_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(0 13.1787)"
          />
        </clipPath>
        <clipPath id="clip3_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(13.168 13.1787)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function MainNavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-center md:gap-8",
        className
      )}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/book"
              ? pathname === "/book"
              : item.href.startsWith("/#")
                ? false
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "font-sans text-base font-medium text-ink transition-colors hover:text-accent-brand",
              isActive && "text-accent-brand"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer border-0 bg-transparent p-0"
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
          fill="#B68973"
          fillOpacity="0.14"
        />
        <g clipPath="url(#clip0_4566_1431)">
          {isDark ? (
            <g transform="translate(10 10) scale(0.8333333333333334)">
              <path
                d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                stroke="#B68973"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          ) : (
            <path
              d="M20.0003 11.6667V13.3333M20.0003 26.6667V28.3333M13.3337 20H11.667M15.2621 15.2618L14.0836 14.0833M24.7386 15.2618L25.9171 14.0833M15.2621 24.7417L14.0836 25.9202M24.7386 24.7417L25.9171 25.9202M28.3337 20H26.667M24.167 20C24.167 22.3012 22.3015 24.1667 20.0003 24.1667C17.6991 24.1667 15.8337 22.3012 15.8337 20C15.8337 17.6988 17.6991 15.8333 20.0003 15.8333C22.3015 15.8333 24.167 17.6988 24.167 20Z"
              stroke="#B68973"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
        <defs>
          <clipPath id="clip0_4566_1431">
            <rect
              width="20"
              height="20"
              fill="white"
              transform="translate(10 10)"
            />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip bg-background flex w-full items-center justify-between gap-4 px-6 py-4 md:gap-8 md:py-5 lg:px-10"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3"
      >
        <LogoMark />
        <span className="whitespace-nowrap font-display font-semibold text-[clamp(1.1rem,4vw,1.806rem)] leading-none tracking-[-0.03em] text-foreground">
          MindfulUX Growth
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:gap-8">
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-8 md:flex">
          <MainNavLinks className="flex-row items-center gap-8" />
        </div>
        <ThemeToggle />
        <div className="flex items-center md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-ink"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border-subtle w-[min(100%,320px)]">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8 pt-6">
                <MainNavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
