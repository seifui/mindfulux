import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import pdf from "pdf-parse";

// Load .env.local from the repo root before anything else.
config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

// ── Section heading map ────────────────────────────────────────────────────────

interface SectionDef {
  label: string;
  column: string;
}

const SECTIONS: SectionDef[] = [
  { label: "What Is It?",              column: "what_is_it" },
  { label: "History",                  column: "history" },
  { label: "The Psychology Behind It", column: "psychology_behind" },
  { label: "Why It Matters",           column: "why_it_matters" },
  { label: "How to Apply It",          column: "how_to_apply" },
  { label: "Theory in Action",         column: "theory_in_action" },
  { label: "Final Thought",            column: "final_thought" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Collapse runs of whitespace and trim. */
function normalise(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Derive a display title from a PDF filename.
 * Rules:
 *   1. Strip ".pdf" extension.
 *   2. Remove trailing duplicate suffix like " - 2" or "-2".
 *   3. Replace hyphens/underscores with spaces.
 *   4. Title-case each word.
 */
function titleFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.pdf$/i, "");
  // Remove " - 2" or "-2" duplicate suffixes
  const deduped = withoutExt.replace(/\s*-\s*\d+$/, "");
  const spaced = deduped.replace(/[-_]+/g, " ");
  return spaced
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Slugify: lowercase, spaces → hyphens, drop non-alphanumeric (except hyphens). */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract section text from the flat PDF string.
 * Strategy:
 *   - Find each heading as a standalone line (after normalisation).
 *   - Capture text between consecutive headings.
 *   - Returns a Record<column, text>.
 */
function extractSections(rawText: string): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const s of SECTIONS) result[s.column] = null;

  // Split on newlines; trim each line; filter empties.
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Build a lookup: heading label → index in SECTIONS array
  const headingIndex = new Map<string, number>(
    SECTIONS.map((s, i) => [s.label.toLowerCase(), i])
  );

  let currentSection = -1;
  const buffers: string[][] = SECTIONS.map(() => []);

  for (const line of lines) {
    const lower = line.toLowerCase();
    // Check whether this line IS a section heading (exact match, case-insensitive)
    const idx = headingIndex.get(lower);
    if (idx !== undefined) {
      currentSection = idx;
      continue;
    }
    if (currentSection >= 0) {
      buffers[currentSection].push(line);
    }
  }

  for (let i = 0; i < SECTIONS.length; i++) {
    const text = buffers[i].join("\n").trim();
    result[SECTIONS[i].column] = text.length > 0 ? text : null;
  }

  return result;
}

/**
 * Build a short description from what_is_it (first ~280 chars, ending on a
 * sentence boundary where possible) for getPublishedPrinciples() on the book page.
 */
function buildDescription(whatIsIt: string | null): string | null {
  if (!whatIsIt) return null;
  const first = whatIsIt.slice(0, 280);
  const sentenceEnd = first.search(/[.!?][^.!?]*$/);
  if (sentenceEnd > 40) return first.slice(0, sentenceEnd + 1).trim();
  return first.trim();
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const pdfsDir = path.resolve(process.cwd(), "scripts/seeds/pdfs");

  let entries: string[];
  try {
    entries = (await fs.readdir(pdfsDir)).filter((f) =>
      f.toLowerCase().endsWith(".pdf")
    );
  } catch {
    console.error(`✗ Could not read PDFs directory: ${pdfsDir}`);
    process.exit(1);
  }

  if (entries.length === 0) {
    console.log("⚠  No PDF files found in scripts/seeds/pdfs/ — nothing to seed.");
    return;
  }

  let inserted = 0;
  let failed = 0;

  for (const filename of entries) {
    const title = titleFromFilename(filename);
    const slug = slugify(title);

    try {
      const buffer = await fs.readFile(path.join(pdfsDir, filename));
      const parsed = await pdf(buffer);
      const sections = extractSections(parsed.text);

      const hasContent = Object.values(sections).some((v) => v !== null);
      const description = buildDescription(sections["what_is_it"]);

      const row = {
        slug,
        title,
        description,
        ...sections,
        category: "ux-psychology",
        published: hasContent,
        is_preview: false,
      };

      const { error } = await supabase
        .from("principles")
        .upsert(row, { onConflict: "slug" });

      if (error) {
        console.error(`✗ Failed:   ${title}  —  ${error.message}`);
        failed++;
      } else {
        console.log(`✓ Inserted: ${title}`);
        inserted++;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✗ Failed:   ${title}  —  ${message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${failed} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
