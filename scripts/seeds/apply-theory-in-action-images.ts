/**
 * Apply Cloudflare Images IDs to principles.theory_in_action_image_urls from manifest.
 * Run: pnpm seed:theory-in-action-images
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
    "scripts/seeds/theory-in-action-images.json",
  );
  let raw: string;
  try {
    raw = await fs.readFile(manifestPath, "utf8");
  } catch {
    console.error(`✗ Could not read ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(raw) as Record<string, string[]>;
  const entries = Object.entries(manifest).filter(
    ([, ids]) => Array.isArray(ids) && ids.some((id) => typeof id === "string" && id.trim()),
  );

  if (entries.length === 0) {
    console.log(
      "⚠  Manifest is empty — run pnpm seed:upload-images after adding files under scripts/seeds/images/",
    );
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const [slug, ids] of entries) {
    const cleaned = ids.map((id) => id.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from("principles")
      .update({ theory_in_action_image_urls: cleaned })
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
    console.log(`✓ ${slug} (${cleaned.length} image${cleaned.length === 1 ? "" : "s"})`);
    ok++;
  }

  console.log(`\nDone: ${ok} updated, ${failed} failed`);
}

main();
