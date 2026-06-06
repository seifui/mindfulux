import type { MetadataRoute } from "next";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindfuluxgrowth.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now },
    { url: `${BASE_URL}/principles`, lastModified: now },
    { url: `${BASE_URL}/book`, lastModified: now },
    { url: `${BASE_URL}/login`, lastModified: now },
  ];

  const supabase = getSupabaseAdmin();
  if (!supabase) return staticRoutes;

  const { data } = await supabase
    .from("principles")
    .select("slug, created_at")
    .eq("published", true)
    .order("principle_number", { ascending: true });

  const principleRoutes: MetadataRoute.Sitemap = (data ?? []).map((row) => ({
    url: `${BASE_URL}/principles/${row.slug}`,
    lastModified: row.created_at ? new Date(row.created_at) : now,
  }));

  return [...staticRoutes, ...principleRoutes];
}
