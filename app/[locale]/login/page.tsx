import { getTranslations } from "next-intl/server";

import { LoginAuthForm } from "@/components/auth/LoginAuthForm";
import { Navbar } from "@/components/layout/Navbar";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("loginTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center py-16">
        <div className="w-full max-w-md rounded-card border border-border-subtle bg-card p-8 shadow-sm">
          <h1 className="mb-2 text-center font-display text-3xl font-semibold tracking-[-0.03em] text-ink">
            {t("loginHeading")}
          </h1>
          <p className="mb-8 text-center text-sm text-muted-text">
            {t("loginSubtext")}
          </p>
          <LoginAuthForm />
        </div>
      </main>
    </div>
  );
}
