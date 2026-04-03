"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import { trackPrincipleCardClicked } from "@/lib/analytics";

interface PrincipleCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  slug?: string;
  className?: string;
  position?: number;
  section?: string;
  asLink?: boolean;
  /** When set, overrides default `/principles/[slug]` target */
  linkHref?: string;
}

export function PrincipleCard({
  title,
  description,
  imageUrl,
  slug: slugProp,
  className,
  position = 0,
  section = "principles-grid",
  asLink = true,
  linkHref,
}: PrincipleCardProps) {
  const slug = slugProp ?? title.toLowerCase().replace(/\s+/g, "-");
  const src = imageUrl ?? "/illustrations/centre-stage-effect.png";

  const card = (
    <article
      className={cn(
        "flex w-[297px] shrink-0 snap-start flex-col gap-5 rounded-card bg-card-fill p-6 transition-shadow",
        asLink && "cursor-pointer hover:shadow-promo",
        className
      )}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-card bg-principle-detail-hero-well">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="297px"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[24px] font-semibold leading-[1.3] text-ink">
          {title}
        </h3>
        <p className="font-sans text-sm font-medium leading-[20px] tracking-[-0.28px] text-ink line-clamp-3">
          {description}
        </p>
      </div>
    </article>
  );

  if (!asLink) {
    return <div className="block">{card}</div>;
  }

  return (
    <Link
      href={linkHref ?? `/principles/${slug}`}
      className="block"
      onClick={() => trackPrincipleCardClicked(slug, position, section)}
    >
      {card}
    </Link>
  );
}
