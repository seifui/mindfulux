/**
 * Assign principle_number as a simple row counter: 1, 2, 3…
 * Order: oldest row first (created_at, then id).
 * Run: pnpm seed:numbers
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
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
  const { data: rows, error: fetchError } = await supabase
    .from("principles")
    .select("id, slug, title, created_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (fetchError) {
    console.error(`✗ ${fetchError.message}`);
    process.exit(1);
  }

  if (!rows?.length) {
    console.log("⚠  No principles rows to number.");
    return;
  }

  // Pass 1: move out of 1…n range so unique constraint never clashes.
  for (let i = 0; i < rows.length; i++) {
    const { error } = await supabase
      .from("principles")
      .update({ principle_number: 100_000 + i + 1 })
      .eq("id", rows[i].id);
    if (error) {
      console.error(`✗ (pass 1) ${rows[i].slug}: ${error.message}`);
      process.exit(1);
    }
  }

  // Pass 2: sequential 1, 2, 3…
  let failed = 0;
  for (let i = 0; i < rows.length; i++) {
    const n = i + 1;
    const { error } = await supabase
      .from("principles")
      .update({ principle_number: n })
      .eq("id", rows[i].id);
    if (error) {
      console.error(`✗ (pass 2) ${rows[i].slug}: ${error.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone: ${rows.length - failed} rows numbered 1–${rows.length} (by created_at)`,
  );
  if (rows.length <= 5) {
    for (let i = 0; i < rows.length; i++) {
      console.log(`  ${i + 1}. ${rows[i].title}`);
    }
  } else {
    console.log(`  1. ${rows[0].title}`);
    console.log(`  …`);
    console.log(`  ${rows.length}. ${rows[rows.length - 1].title}`);
  }
}

main();
