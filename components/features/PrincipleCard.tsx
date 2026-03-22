import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface PrincipleCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

export function PrincipleCard({ title, description, className }: PrincipleCardProps) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/principles/${slug}`} className="block">
    <article className={cn("flex w-[297px] shrink-0 snap-start flex-col gap-5 rounded-card bg-card-fill p-6 cursor-pointer transition-shadow hover:shadow-promo", className)}>
      {/* Illustration */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-card bg-gray-100">
        <Image
          src="/illustrations/centre-stage-effect.png"
          alt="Centre Stage Effect"
          width={249}
          height={124}
          style={{ objectFit: "contain" }}
          className="h-full w-full"
        />
      </div>

      {/* Text block */}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[24px] font-semibold leading-[1.3] text-ink">
          {title}
        </h3>
        <p className="font-sans text-sm font-medium leading-[20px] tracking-[-0.28px] text-ink line-clamp-3">
          {description}
        </p>
      </div>
    </article>
    </Link>
  );
}
