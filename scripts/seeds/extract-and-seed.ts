import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Dirent } from "node:fs";
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

try {
  console.log(`→ Target Supabase host: ${new URL(url).hostname}`);
} catch {
  console.log("→ Target Supabase: (check NEXT_PUBLIC_SUPABASE_URL)");
}

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
 * pdf-parse often emits broken line breaks as a leading `n ` or `nn ` on a line
 * (e.g. "n What is it?"). That is a letter, so it must be stripped before
 * `stripHeadingDecor`, or headings never match SECTIONS labels.
 */
function stripPdfArtifactPrefix(line: string): string {
  return line.replace(/^\s*n+\s+/u, "").trim();
}

/**
 * PDFs often prefix headings with icons (■, ●, ■■). The parser expects plain
 * titles like "What Is It?" — strip leading non-letters so lines match.
 */
function stripHeadingDecor(line: string): string {
  return line.replace(/^[^\p{L}]+/u, "").trim();
}

/** Normalize full PDF text before line- and regex-based section extraction. */
function normalizePdfText(rawText: string): string {
  return rawText
    .replace(/\r/g, "\n")
    .split("\n")
    .map((ln) => stripPdfArtifactPrefix(ln))
    .join("\n");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Match a section heading line (optional ■ bullets, flexible spaces, optional ?).
 * Uses `m` so `^` matches after newlines — PDFs often lack \n between blocks.
 */
function headingRegex(label: string): RegExp {
  const flex = escapeRegExp(label).replace(/\s+/g, "\\s+");
  return new RegExp(
    `(?:^|\\n)\\s*[^\\p{L}]*\\s*${flex}\\s*[?.:]?\\s*(?:\\n|$)`,
    "miu",
  );
}

/**
 * Second pass: find headings in document order in the full string (works when
 * pdf-parse merges lines or drops newlines so line-based parsing fails).
 */
function extractSectionsOrdered(rawText: string): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const s of SECTIONS) result[s.column] = null;

  const t = rawText;
  let searchFrom = 0;

  for (let i = 0; i < SECTIONS.length; i++) {
    const re = headingRegex(SECTIONS[i].label);
    re.lastIndex = searchFrom;
    const m = re.exec(t);
    if (!m) break;

    const contentStart = m.index + m[0].length;
    let contentEnd = t.length;
    if (i + 1 < SECTIONS.length) {
      const reNext = headingRegex(SECTIONS[i + 1].label);
      reNext.lastIndex = contentStart;
      const nm = reNext.exec(t);
      if (nm) contentEnd = nm.index;
    }

    const body = t.slice(contentStart, contentEnd).trim();
    result[SECTIONS[i].column] = body.length > 0 ? body : null;
    searchFrom = contentEnd;
  }

  return result;
}

/**
 * Extract section text from the flat PDF string.
 * Strategy:
 *   - Find each heading as a standalone line (after normalisation).
 *   - Capture text between consecutive headings.
 *   - Merge with ordered full-text pass for any column still null.
 *   - Returns a Record<column, text>.
 */
function extractSections(rawText: string): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const s of SECTIONS) result[s.column] = null;

  const normalized = normalizePdfText(rawText);

  // Split on newlines; trim each line; filter empties.
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Heading line → section index (PDFs vary: "What Is It?" vs "What is it" vs missing ?)
  const headingIndex = new Map<string, number>();
  for (let i = 0; i < SECTIONS.length; i++) {
    const k = SECTIONS[i].label.toLowerCase().trim();
    headingIndex.set(k, i);
    const noTrailingPunct = k.replace(/[?.:]+$/g, "").trim();
    if (noTrailingPunct && noTrailingPunct !== k) {
      headingIndex.set(noTrailingPunct, i);
    }
  }

  let currentSection = -1;
  const buffers: string[][] = SECTIONS.map(() => []);

  for (const line of lines) {
    const normalized = stripHeadingDecor(line).toLowerCase();
    const stripped = normalized.replace(/[?.:]+$/g, "").trim();
    const idx =
      headingIndex.get(normalized) ?? headingIndex.get(stripped);
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

  const ordered = extractSectionsOrdered(normalized);
  for (const s of SECTIONS) {
    if (!result[s.column] && ordered[s.column]) {
      result[s.column] = ordered[s.column];
    }
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

/** Walk `dir` recursively and return absolute paths to every `.pdf` file. */
async function walkPdfFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries: Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkPdfFiles(p)));
    } else if (e.name.toLowerCase().endsWith(".pdf")) {
      out.push(p);
    }
  }
  return out;
}

/**
 * Homepage A/B/C carousels: put PDFs under `pdfs/a/`, `pdfs/b/`, or `pdfs/c/`.
 * Files directly under `pdfs/` get `home_section: null` (not shown in those rows).
 */
function homeSectionFromPdfPath(
  pdfsRoot: string,
  absolutePdfPath: string,
): "a" | "b" | "c" | null {
  const relDir = path.relative(pdfsRoot, path.dirname(absolutePdfPath));
  if (!relDir || relDir === ".") return null;
  const first = relDir.split(path.sep)[0]?.toLowerCase();
  if (first === "a" || first === "b" || first === "c") return first;
  return null;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const pdfsDir = path.resolve(process.cwd(), "scripts/seeds/pdfs");

  let pdfPaths: string[];
  try {
    pdfPaths = await walkPdfFiles(pdfsDir);
  } catch {
    console.error(`✗ Could not read PDFs directory: ${pdfsDir}`);
    process.exit(1);
  }

  if (pdfPaths.length === 0) {
    console.log("⚠  No PDF files found in scripts/seeds/pdfs/ — nothing to seed.");
    return;
  }

  let inserted = 0;
  let failed = 0;

  for (const absolutePath of pdfPaths) {
    const filename = path.basename(absolutePath);
    const home_section = homeSectionFromPdfPath(pdfsDir, absolutePath);
    const title = titleFromFilename(filename);
    const slug = slugify(title);

    try {
      const buffer = await fs.readFile(absolutePath);
      const parsed = await pdf(buffer);
      const sections = extractSections(parsed.text);

      const hasContent = Object.values(sections).some((v) => v !== null);
      const description = buildDescription(
        sections["what_is_it"] ??
          sections["psychology_behind"] ??
          sections["why_it_matters"] ??
          sections["history"],
      );

      const row = {
        slug,
        title,
        description,
        ...sections,
        category: "ux-psychology",
        home_section,
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
        const homeLabel = home_section ?? "—";
        const descOk = row.description ? "desc ✓" : "desc ✗";
        console.log(
          `✓ Upserted: ${title}  (home: ${homeLabel}, ${descOk})`,
        );
        if (!hasContent) {
          console.warn(
            `  ⚠ No sections parsed for "${title}" — check PDF headings match SECTIONS labels.`,
          );
        }
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
