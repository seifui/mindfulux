import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/access";

import { UserMenu } from "./UserMenu";

export async function AuthNavActions() {
  const t = await getTranslations("auth");
  const user = await getAuthUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="font-sans text-sm font-medium text-ink transition-colors hover:text-accent-brand sm:text-base"
      >
        {t("signIn")}
      </Link>
    );
  }

  return null;
}

export async function UserNavActions() {
  const t = await getTranslations("auth");
  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  return (
    <UserMenu
      email={user.email ?? "Account"}
      signOutLabel={t("signOut")}
      settingsLabel={t("settings")}
    />
  );
}
