import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

async function columnExists(): Promise<boolean> {
  if (!url || !key) return false;
  const supabase = createClient(url, key);
  const { error } = await supabase.from("principles").select("principle_number").limit(1);
  return !error;
}

async function applyViaPostgres(): Promise<void> {
  if (!dbUrl) {
    throw new Error(
      "Set SUPABASE_DB_URL (or DATABASE_URL) in .env.local — use the Supabase dashboard connection string (Session pooler).",
    );
  }
  const { default: postgres } = await import("postgres");
  const sql = postgres(dbUrl, { max: 1 });
  const migrationPath = path.resolve(
    process.cwd(),
    "supabase/migrations/20260404120000_principles_principle_number.sql",
  );
  const migrationSql = await fs.readFile(migrationPath, "utf8");
  await sql.unsafe(migrationSql);
  await sql.end();
}

async function main() {
  if (await columnExists()) {
    console.log("✓ principle_number column already exists");
    return;
  }

  console.log("→ Applying principle_number migration…");
  try {
    await applyViaPostgres();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`✗ Could not apply migration automatically: ${message}`);
    console.error(
      "\nRun this SQL in the Supabase SQL editor (Dashboard → SQL):\n",
    );
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20260404120000_principles_principle_number.sql",
    );
    console.error(await fs.readFile(migrationPath, "utf8"));
    process.exit(1);
  }

  if (!(await columnExists())) {
    console.error("✗ Migration ran but principle_number column is still missing.");
    process.exit(1);
  }
  console.log("✓ principle_number column ready");
}

main();
