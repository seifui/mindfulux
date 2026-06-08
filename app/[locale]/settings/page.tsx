import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/access";

import { SettingsForm } from "@/components/features/SettingsForm";
import { Navbar } from "@/components/layout/Navbar";

export async function generateMetadata() {
  return { title: "Settings — MindfulUX Growth" };
}

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    return;
  }

  const email = user.email ?? "";
  const initialName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : undefined) ??
    (typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : undefined) ??
    "";
  const isGoogleUser =
    user.identities?.some((identity) => identity.provider === "google") ??
    false;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-content flex-1 flex-col px-6 pb-20 pt-10 md:px-0 md:pt-14">
        <header className="pb-8 md:pb-10">
          <h1 className="font-display text-detail-title font-semibold leading-none text-ink">
            Settings
          </h1>
        </header>

        <SettingsForm
          email={email}
          initialName={initialName}
          isGoogleUser={isGoogleUser}
        />
      </main>
    </div>
  );
}
