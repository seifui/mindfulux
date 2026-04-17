import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Book cover for the “Book is out now!” promo card.
 * Frame matches cover asset: 746×1024 (≈98.75×128 display), corner radius 0, no shadow.
 */
export function BookIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-visible rounded-none rotate-6",
        "aspect-[373/512] w-[min(98.75px,100%)] max-w-[98.75px]",
        className,
      )}
    >
      <Image
        src="/images/book-cover.png"
        alt="Designing for the Human Mind book cover"
        fill
        sizes="99px"
        className="object-contain object-center"
        priority={false}
      />
    </div>
  );
}
