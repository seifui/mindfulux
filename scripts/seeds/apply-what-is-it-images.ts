/**
 * Apply Cloudflare Images IDs to principles.what_is_it_image_url from manifest.
 * Run: pnpm seed:what-is-it-images
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("✗ Missing Supabase env in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const manifestPath = path.resolve(
    process.cwd(),
    "scripts/seeds/what-is-it-images.json",
  );
  let raw: string;
  try {
    raw = await fs.readFile(manifestPath, "utf8");
  } catch {
    console.error(`✗ Could not read ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(raw) as Record<string, string>;
  const entries = Object.entries(manifest).filter(
    ([, imageId]) => typeof imageId === "string" && imageId.trim().length > 0,
  );

  if (entries.length === 0) {
    console.log("⚠  Manifest is empty — add slug → Cloudflare image ID entries.");
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const [slug, imageId] of entries) {
    const { data, error } = await supabase
      .from("principles")
      .update({ what_is_it_image_url: imageId.trim() })
      .eq("slug", slug)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(`✗ ${slug}: ${error.message}`);
      failed++;
      continue;
    }
    if (!data) {
      console.error(`✗ ${slug}: no matching principle row`);
      failed++;
      continue;
    }
    console.log(`✓ ${slug}`);
    ok++;
  }

  console.log(`\nDone: ${ok} updated, ${failed} failed`);
}

main();
