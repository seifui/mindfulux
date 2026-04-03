---
name: Supabase principles content
overview: The Claude plan is directionally sound (FTS, seed script, package.json) but must not add a second `CREATE TABLE principles`—this repo already defines `principles` in an existing migration. Use a follow-up migration with `ALTER TABLE`, align columns with [lib/principles.ts](lib/principles.ts), and extend the seed to populate legacy fields (`description`, `published`, etc.).
todos:
  - id: migration-alter
    content: "Add new supabase migration: ALTER public.principles for section columns + search_vector GIN + optional SELECT policy (timestamp after 20260328130000)"
    status: completed
  - id: seed-script
    content: "Implement extract-and-seed.ts: pdf-parse, section split, slug/title from filename, upsert with description/published/is_preview"
    status: completed
  - id: package-json
    content: Add seed script + devDependencies (tsx, dotenv, pdf-parse)
    status: completed
isProject: false
---

# Review: Supabase principles + PDF seed plan

## Critical fix: existing `principles` table

`[supabase/migrations/20260328130000_book_waitlist_principles.sql](supabase/migrations/20260328130000_book_waitlist_principles.sql)` already creates `public.principles` with:

- `slug`, `title`, `description`, `illustration_url`, `published`, `is_preview`, `created_at`

`[lib/principles.ts](lib/principles.ts)` queries that shape (`description`, `illustration_url`, `published`). A new file named `20240101000000_create_principles_table.sql` would either:

- **Fail** on a DB that already applied the 20260328 migration (`relation "principles" already exists`), or
- **Do nothing useful** if someone used `IF NOT EXISTS` without altering columns (you would never get the new section columns).

**Recommendation:** Replace the proposed “create table” migration with a **new migration after 20260328** (e.g. `20260401120000_principles_section_content.sql`) that only:

1. `ALTER TABLE public.principles ADD COLUMN IF NOT EXISTS` for each section column (`what_is_it`, `history`, …) and optional `category text` (your default `'ux-psychology'` is fine).
2. Add the `search_vector` generated column and `GIN` index (same logic as Claude’s plan; consider adding `history` and `psychology_behind` to the `to_tsvector` expression for richer search).
3. **RLS:** Table already has `ENABLE ROW LEVEL SECURITY` with **no `SELECT` policy** in-repo. If you intend anonymous/public reads via the anon key, add the `SELECT USING (true)` policy here (matches Claude’s intent). If everything stays service-role-only, the policy is optional but harmless for read-only catalogue data.

Do **not** drop or recreate `principles`; preserve `published`, `is_preview`, `description`, `illustration_url`.

## Schema / product notes

- **List cards vs detail content:** Storing sections as plain `text` matches simple PDF extraction; the app’s principle detail page today uses richer mock structures (paragraphs vs bullets). That is a **separate follow-up** (e.g. markdown in DB, or JSON). For this task, flat text is still a valid CMS-style store.
- `**description`:** Keep populating it in the seed (e.g. first ~200–300 chars of `what_is_it`, or first paragraph) so `[getPublishedPrinciples](lib/principles.ts)` keeps working for the book page.
- `**published` / `is_preview`:** On upsert, set explicitly (e.g. `published: true`, `is_preview: false` when full sections exist) so behaviour is predictable vs the two seeded rows in the existing migration.

## Seed script (`scripts/seeds/extract-and-seed.ts`)

Claude’s behaviour list is good. Additional suggestions:


| Topic               | Suggestion                                                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase client** | Reuse `[getSupabaseAdmin()](lib/supabase-admin.ts)` or duplicate the same env vars; avoid introducing a third pattern. If you use `@/` imports, run via `tsx` with project `[tsconfig.json](tsconfig.json)` paths (usually works as-is).                    |
| **Env loading**     | `dotenv.config({ path: '.env.local' })` from repo root; exit with a clear error if URL/key missing (service role must never ship to the client).                                                                                                            |
| **Dependencies**    | Add dev deps: `tsx`, `dotenv`, `pdf-parse`, and `@types/node` if not already sufficient. `@supabase/supabase-js` is already a dependency.                                                                                                                   |
| **PDF text**        | `pdf-parse` returns one string; headings may differ by case/whitespace. Normalize extracted text (e.g. collapse whitespace, optional case-fold for matching) and keep “exact heading” search as primary with a documented fallback if a section is missing. |
| **Upsert**          | Use `.upsert(rows, { onConflict: 'slug' })` and include columns you want overwritten; omit `id` so existing UUIDs stay stable on conflict.                                                                                                                  |
| **Logging**         | Claude’s ✓/✗ and totals are fine; distinguish “skipped (no PDFs)” if the folder is empty.                                                                                                                                                                   |


## `package.json`

Adding `"seed": "tsx scripts/seeds/extract-and-seed.ts"` is correct; you will need `tsx` installed.

## PDFs path

Glob currently shows **no `.pdf` files** under `scripts/seeds/pdfs/` in the workspace snapshot (may be gitignored or not yet added). The script should still use that directory; confirm files are present before running the seed locally.

---

## Draft files for review (revised)

Below are **review copies** reflecting the fixes above. Final filenames/timestamps can be adjusted when you implement.

**1) New migration (ALTER-only, example name)**

```sql
-- Add long-form principle content + FTS (extends existing public.principles)

alter table public.principles
  add column if not exists what_is_it text,
  add column if not exists history text,
  add column if not exists psychology_behind text,
  add column if not exists why_it_matters text,
  add column if not exists how_to_apply text,
  add column if not exists theory_in_action text,
  add column if not exists final_thought text,
  add column if not exists category text default 'ux-psychology';

alter table public.principles
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(what_is_it, '') || ' ' ||
      coalesce(history, '') || ' ' ||
      coalesce(psychology_behind, '') || ' ' ||
      coalesce(why_it_matters, '') || ' ' ||
      coalesce(how_to_apply, '')
    )
  ) stored;

create index if not exists principles_search_idx
  on public.principles using gin (search_vector);

-- Optional: public read for catalogue (anon key)
drop policy if exists "Public can read principles" on public.principles;
create policy "Public can read principles"
  on public.principles for select using (true);
```

**Note:** If `ADD COLUMN ... GENERATED` fails in your Supabase Postgres version or due to migration ordering quirks, fallback is a separate `ALTER` that adds the column only after all source columns exist (single statement as above is standard on PG 12+).

**2) Seed script (skeleton — implement parsing/upsert as specified)**

```ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import pdf from "pdf-parse";

config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const SECTION_HEADINGS: { label: string; column: string }[] = [
  { label: "What Is It?", column: "what_is_it" },
  { label: "History", column: "history" },
  { label: "The Psychology Behind It", column: "psychology_behind" },
  { label: "Why It Matters", column: "why_it_matters" },
  { label: "How to Apply It", column: "how_to_apply" },
  { label: "Theory in Action", column: "theory_in_action" },
  { label: "Final Thought", column: "final_thought" },
];

// TODO: readdir scripts/seeds/pdfs, parse each PDF, map sections → columns,
// slug + title from filename, build description snippet, upsert with published/is_preview

async function main() {
  let inserted = 0;
  let failed = 0;
  // ...
  console.log(`Done: ${inserted} inserted, ${failed} failed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

---

## Summary

- **Reject** the standalone `CREATE TABLE principles` migration as written; **use ALTER** on the existing table and a **newer timestamp** than `20260328130000`.
- **Extend** the seed upsert to fill `description`, `published`, and `is_preview` so current app code keeps working.
- **Keep** FTS + GIN index + optional public `SELECT` policy; optionally widen FTS to include `history` / `psychology_behind`.
- **Add** `tsx`, `dotenv`, `pdf-parse` and the `seed` npm script.

No commands or file writes were run (plan mode).