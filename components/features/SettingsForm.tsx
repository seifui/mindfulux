"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type SettingsFormProps = {
  email: string;
  initialName: string;
  isGoogleUser: boolean;
};

const inputClassName =
  "h-12 rounded-pill border-0 bg-input-fill px-6 text-base font-medium text-ink placeholder:text-muted-text focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent dark:bg-input-fill";

export function SettingsForm({
  email,
  initialName,
  isGoogleUser,
}: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saveLoading, setSaveLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
      });
      setSaveLoading(false);
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
      duration: 3000,
    });
    setSaveLoading(false);
    router.refresh();
  }

  async function handleResetPassword() {
    setResetLoading(true);
    setResetSuccess(false);
    setResetError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setResetError("Could not send password reset email. Please try again.");
      setResetLoading(false);
      return;
    }

    setResetSuccess(true);
    setResetLoading(false);
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold text-ink">General</h2>
          <p className="text-sm text-muted-text">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="overflow-hidden rounded-card border border-border-subtle bg-card divide-y divide-border-subtle">
          <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
            <Label
              htmlFor="settings-name"
              className="shrink-0 font-sans text-sm font-medium text-ink sm:w-28"
            >
              Name
            </Label>
            <Input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={saveLoading}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6">
            <span className="shrink-0 font-sans text-sm font-medium text-ink sm:w-28 sm:pt-0.5">
              Email
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="break-all text-base font-medium text-ink">
                {email}
              </span>
              {isGoogleUser ? (
                <p className="text-sm text-muted-text">
                  Your account uses Google sign in — email cannot be changed
                </p>
              ) : null}
            </div>
          </div>

          {!isGoogleUser ? (
            <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="shrink-0 font-sans text-sm font-medium text-ink sm:w-28">
                Password
              </span>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="link"
                  disabled={resetLoading}
                  onClick={() => void handleResetPassword()}
                  className="h-auto justify-start p-0 text-base font-medium text-accent-brand hover:text-accent-brand/90"
                >
                  Reset password
                </Button>
                {resetSuccess ? (
                  <p className="text-sm font-medium text-ink">
                    Password reset email sent
                  </p>
                ) : null}
                {resetError ? (
                  <p className="text-sm text-destructive">{resetError}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSave}>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={saveLoading || signOutLoading}
              className="h-12 rounded-pill bg-accent-brand px-6 text-base font-semibold text-white hover:bg-accent-brand/90"
            >
              {saveLoading ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="link"
              disabled={saveLoading || signOutLoading}
              onClick={() => void handleSignOut()}
              className="h-12 px-2 text-base font-semibold text-accent-brand hover:text-accent-brand/90"
            >
              {signOutLoading ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </form>
    </section>
  );
}
