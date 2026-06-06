/**
 * Apply what_is_it_image_url + theory_in_action_image_urls migrations.
 * Run: pnpm seed:migrate:images
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

const MIGRATIONS = [
  "20260405120000_principles_what_is_it_image.sql",
  "20260406120000_principles_theory_in_action_images.sql",
];

async function columnsExist(): Promise<boolean> {
  if (!url || !key) return false;
  const supabase = createClient(url, key);
  const { error } = await supabase
    .from("principles")
    .select("what_is_it_image_url, theory_in_action_image_urls")
    .limit(1);
  return !error;
}

async function applyViaPostgres(): Promise<void> {
  if (!dbUrl) {
    throw new Error(
      "Set SUPABASE_DB_URL (or DATABASE_URL) in .env.local — Supabase dashboard → Project Settings → Database → connection string.",
    );
  }
  const { default: postgres } = await import("postgres");
  const sql = postgres(dbUrl, { max: 1 });
  for (const file of MIGRATIONS) {
    const migrationPath = path.resolve(process.cwd(), "supabase/migrations", file);
    const migrationSql = await fs.readFile(migrationPath, "utf8");
    await sql.unsafe(migrationSql);
    console.log(`✓ Applied ${file}`);
  }
  await sql.end();
}

async function main() {
  if (await columnsExist()) {
    console.log("✓ Section image columns already exist");
    return;
  }

  console.log("→ Applying section image migrations…");
  try {
    await applyViaPostgres();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`✗ Could not apply migrations automatically: ${message}`);
    console.error("\nRun these in the Supabase SQL editor:\n");
    for (const file of MIGRATIONS) {
      const migrationPath = path.resolve(process.cwd(), "supabase/migrations", file);
      console.error(`-- ${file}\n`);
      console.error(await fs.readFile(migrationPath, "utf8"));
    }
    process.exit(1);
  }

  if (!(await columnsExist())) {
    console.error("✗ Migrations ran but image columns are still missing.");
    process.exit(1);
  }
  console.log("✓ Section image columns ready");
}

main();
