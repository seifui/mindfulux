"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  email: string;
  signOutLabel: string;
  settingsLabel: string;
};

function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.slice(0, 2).toUpperCase();
}

const menuItemClassName =
  "cursor-pointer rounded-md px-3 py-2 font-sans text-base font-medium text-ink focus:bg-card-fill hover:bg-card-fill";

export function UserMenu({
  email,
  signOutLabel,
  settingsLabel,
}: UserMenuProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-accent-brand/15 font-sans text-xs font-semibold text-accent-brand outline-none transition-colors hover:bg-accent-brand/25 focus-visible:ring-2 focus-visible:ring-accent-brand/40"
          title={email}
          aria-label="Account menu"
        >
          {initialsFromEmail(email)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="min-w-40 rounded-card border border-border-subtle bg-card p-1 font-sans text-base text-ink shadow-promo"
      >
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/settings">{settingsLabel}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border-subtle" />
        <DropdownMenuItem
          className={`${menuItemClassName} text-accent-brand focus:text-accent-brand hover:text-accent-brand`}
          onSelect={() => {
            void handleSignOut();
          }}
        >
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
