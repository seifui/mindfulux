// Run with: npx tsx scripts/sync-cloudflare-images.ts
// This script uses .env.uat credentials
// To switch to production, change path to '.env.local'
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import { loadCloudflareImagesConfig } from "./seeds/lib/cloudflare-images-api";
import { slugify } from "./seeds/lib/slug-from-filename";

dotenv.config({ path: ".env.local", override: true });

const IMAGE_EXTS = /\.(png|webp|jpe?g|gif)$/i;

const WHAT_IS_IT_SUFFIXES = [
  "-what's it",
  "-wht's it",
  "-whats it",
  "-whtsit",
] as const;

type ImageType = "what-is-it" | "theory-0" | "theory-1";

type ParsedImage = {
  cfId: string;
  filename: string;
  type: ImageType;
  principleName: string;
};

type CfImage = {
  id: string;
  filename?: string;
  meta?: Record<string, string>;
};

const dryRun = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MANIFEST_WHAT = path.resolve(
  process.cwd(),
  "scripts/seeds/what-is-it-images.json",
);
const MANIFEST_THEORY = path.resolve(
  process.cwd(),
  "scripts/seeds/theory-in-action-images.json",
);

function stripExtension(name: string): string {
  return name.replace(IMAGE_EXTS, "");
}

function parseFromMeta(
  meta?: Record<string, string>,
): Omit<ParsedImage, "cfId" | "filename"> | null {
  if (!meta?.slug || !meta?.section) return null;
  if (meta.section === "what-is-it") {
    return { type: "what-is-it", principleName: meta.slug };
  }
  if (meta.section === "theory-in-action") {
    const idx = Number(meta.index ?? "1") - 1;
    if (idx === 0) return { type: "theory-0", principleName: meta.slug };
    if (idx === 1) return { type: "theory-1", principleName: meta.slug };
  }
  return null;
}

function parseFromFilename(
  filename: string,
): Omit<ParsedImage, "cfId" | "filename"> | null {
  const base = stripExtension(filename);
  const lower = base.toLowerCase();

  for (const suffix of WHAT_IS_IT_SUFFIXES) {
    if (lower.endsWith(suffix)) {
      const principleName = base
        .slice(0, base.length - suffix.length)
        .replace(/[\s-]+$/, "")
        .trim();
      if (!principleName) return null;
      return { type: "what-is-it", principleName };
    }
  }

  if (lower.endsWith("-one")) {
    const principleName = base.slice(0, -4).replace(/[\s-]+$/, "").trim();
    return principleName ? { type: "theory-0", principleName } : null;
  }

  if (lower.endsWith("-two")) {
    const principleName = base.slice(0, -4).replace(/[\s-]+$/, "").trim();
    return principleName ? { type: "theory-1", principleName } : null;
  }

  return null;
}

async function fetchAllCloudflareImages(
  accountId: string,
  token: string,
): Promise<CfImage[]> {
  const all: CfImage[] = [];
  let continuationToken: string | undefined;

  do {
    const params = new URLSearchParams({ per_page: "100" });
    if (continuationToken) params.set("continuation_token", continuationToken);

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as {
      success: boolean;
      errors?: { message: string }[];
      result?: { images?: CfImage[]; continuation_token?: string };
    };

    if (!res.ok || !json.success) {
      throw new Error(
        json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`,
      );
    }

    all.push(...(json.result?.images ?? []));
    continuationToken = json.result?.continuation_token || undefined;
  } while (continuationToken);

  return all;
}

function resolveSlug(
  principleNameOrSlug: string,
  slugSet: Set<string>,
): { slug: string; tried: string[] } | null {
  const candidates = [principleNameOrSlug];
  const derived = slugify(principleNameOrSlug);
  if (!candidates.includes(derived)) candidates.push(derived);
  const tip = `${derived}-tip`;
  if (!candidates.includes(tip)) candidates.push(tip);

  for (const c of candidates) {
    if (slugSet.has(c)) return { slug: c, tried: candidates };
  }
  return null;
}

async function main() {
  const cf = loadCloudflareImagesConfig();
  const images = await fetchAllCloudflareImages(cf.accountId, cf.token);

  const { data: principles, error } = await supabase
    .from("principles")
    .select("id, slug");
  if (error) throw new Error(error.message);

  const slugSet = new Set((principles ?? []).map((p) => p.slug));
  const whatIsItMap = new Map<string, string>();
  const theoryMap = new Map<string, [string | null, string | null]>();

  const stats = {
    total: images.length,
    whatIsIt: 0,
    theory: 0,
    noMatch: 0,
    unknownType: 0,
    errors: 0,
  };

  for (const img of images) {
    const filename = img.filename ?? img.id;
    try {
      const fromMeta = parseFromMeta(img.meta);
      const parsed = fromMeta
        ? { cfId: img.id, filename, ...fromMeta }
        : (() => {
            const fromName = parseFromFilename(filename);
            return fromName ? { cfId: img.id, filename, ...fromName } : null;
          })();

      if (!parsed) {
        console.log(`✗ UNKNOWN TYPE: ${filename}`);
        stats.unknownType++;
        continue;
      }

      const resolved = resolveSlug(parsed.principleName, slugSet);
      if (!resolved) {
        console.log(
          `✗ NO MATCH: ${filename} (tried: ${[slugify(parsed.principleName), `${slugify(parsed.principleName)}-tip`].join(", ")})`,
        );
        stats.noMatch++;
        continue;
      }

      const { slug } = resolved;

      if (parsed.type === "what-is-it") {
        whatIsItMap.set(slug, parsed.cfId);
        console.log(`✓ [what-is-it] ${slug} → ${parsed.cfId}`);
        stats.whatIsIt++;
      } else {
        const pair = theoryMap.get(slug) ?? [null, null];
        pair[parsed.type === "theory-0" ? 0 : 1] = parsed.cfId;
        theoryMap.set(slug, pair);
        console.log(
          `✓ [theory-${parsed.type === "theory-0" ? "one" : "two"}] ${slug} → ${parsed.cfId}`,
        );
        stats.theory++;
      }
    } catch (err) {
      console.error(
        `✗ ERROR ${filename}: ${err instanceof Error ? err.message : err}`,
      );
      stats.errors++;
    }
  }

  if (!dryRun) {
    for (const [slug, imageId] of whatIsItMap) {
      const { error: upErr } = await supabase
        .from("principles")
        .update({ what_is_it_image_url: imageId })
        .eq("slug", slug);
      if (upErr) {
        console.error(`✗ DB what-is-it ${slug}: ${upErr.message}`);
        stats.errors++;
      }
    }

    for (const [slug, [id0, id1]] of theoryMap) {
      const { data: row } = await supabase
        .from("principles")
        .select("theory_in_action_image_urls")
        .eq("slug", slug)
        .maybeSingle();

      const current =
        (row?.theory_in_action_image_urls as string[] | null) ?? [];
      const next = [...current];
      if (id0) next[0] = id0;
      if (id1) next[1] = id1;
      const cleaned = next
        .map((x) => x?.trim())
        .filter((x): x is string => Boolean(x));

      const { error: upErr } = await supabase
        .from("principles")
        .update({ theory_in_action_image_urls: cleaned })
        .eq("slug", slug);
      if (upErr) {
        console.error(`✗ DB theory ${slug}: ${upErr.message}`);
        stats.errors++;
      }
    }

    const theoryManifest = Object.fromEntries(
      [...theoryMap.entries()].map(([slug, [a, b]]) => [
        slug,
        [a, b].filter(Boolean),
      ]),
    );

    await fs.writeFile(
      MANIFEST_WHAT,
      `${JSON.stringify(Object.fromEntries(whatIsItMap), null, 2)}\n`,
    );
    await fs.writeFile(
      MANIFEST_THEORY,
      `${JSON.stringify(theoryManifest, null, 2)}\n`,
    );
  }

  console.log("\n=== SYNC COMPLETE ===" + (dryRun ? " (dry-run)" : ""));
  console.log(`Total images found:          ${stats.total}`);
  console.log(`what_is_it matched:          ${stats.whatIsIt}`);
  console.log(`theory_in_action matched:    ${stats.theory}`);
  console.log(`Unknown type:                ${stats.unknownType}`);
  console.log(`No match found:              ${stats.noMatch}`);
  console.log(`Errors:                      ${stats.errors}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
