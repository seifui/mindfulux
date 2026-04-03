import Image from "next/image";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface BookLockedPrincipleCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  badgeLabel: string;
  className?: string;
}

export function BookLockedPrincipleCard({
  title,
  description,
  imageUrl,
  badgeLabel,
  className,
}: BookLockedPrincipleCardProps) {
  const src = imageUrl ?? "/illustrations/centre-stage-effect.png";

  return (
    <div className={cn("relative block w-full", className)}>
      <article className="flex w-full flex-col gap-5 rounded-card bg-card-fill p-6 opacity-90">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-card bg-gray-100">
          <Image
            src={src}
            alt={title}
            width={249}
            height={124}
            className="h-full w-full object-contain blur-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[24px] font-semibold leading-[1.3] text-ink blur-sm">
            {title}
          </h3>
          <p className="font-sans text-sm font-medium leading-[20px] tracking-[-0.28px] text-ink line-clamp-3 blur-sm">
            {description}
          </p>
        </div>
      </article>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-card bg-background/55 backdrop-blur-[2px]"
        aria-hidden
      >
        <span className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-book-surface text-accent-brand shadow-sm">
          <Lock className="size-5" strokeWidth={2} aria-hidden />
        </span>
        <span className="rounded-pill border border-border-subtle bg-book-surface px-3 py-1 font-sans text-xs font-semibold tracking-[-0.24px] text-brand-dark">
          {badgeLabel}
        </span>
      </div>
    </div>
  );
}
