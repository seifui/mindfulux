"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { authInputClassName } from "@/components/auth/auth-form-styles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  "aria-invalid"?: boolean;
};

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
  "aria-invalid": ariaInvalid,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid}
        className={cn(authInputClassName, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        disabled={disabled}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-text transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
