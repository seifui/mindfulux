"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { trackPrincipleViewed } from "@/lib/analytics";

interface PrincipleViewTrackerProps {
  slug: string;
  category: string;
}

export function PrincipleViewTracker({ slug, category }: PrincipleViewTrackerProps) {
  const params = useParams();
  const locale = (params?.locale as "en" | "si") ?? "en";

  useEffect(() => {
    trackPrincipleViewed(slug, category, locale);
  }, [slug, category, locale]);

  return null;
}
