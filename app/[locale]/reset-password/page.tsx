import { getLocale, getTranslations } from "next-intl/server";

import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Navbar } from "@/components/layout/Navbar";
import { redirect } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/access";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("resetPasswordPageTitle") };
}

export default async function ResetPasswordPage() {
  const user = await getAuthUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    return;
  }

  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center py-16">
        <div className="w-full max-w-md rounded-card border border-border-subtle bg-card p-8 shadow-sm">
          <h1 className="mb-2 text-center font-display text-3xl font-semibold tracking-[-0.03em] text-ink">
            {t("resetPasswordPageTitle")}
          </h1>
          <p className="mb-8 text-center text-sm text-muted-text">
            {t("resetPasswordPageSubtext")}
          </p>
          <UpdatePasswordForm />
        </div>
      </main>
    </div>
  );
}
