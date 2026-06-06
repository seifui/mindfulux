/**
 * Upload local principle section images to Cloudflare Images and write manifests.
 *
 * Folder layout (add PNG/JPG/WebP before running):
 *   scripts/seeds/images/what-is-it/{slug}.png
 *   scripts/seeds/images/theory-in-action/{slug}/1.png, 2.png, …
 *   scripts/seeds/images/illustrations/{slug}.png  (optional card hero)
 *
 * Run:
 *   pnpm seed:migrate:images
 *   pnpm seed:upload-images
 *   pnpm seed:what-is-it-images
 *   pnpm seed:theory-in-action-images
 */
import { config } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import {
  loadCloudflareImagesConfig,
  uploadImageFile,
  verifyCloudflareImagesAuth,
} from "./lib/cloudflare-images-api";

config({ path: path.resolve(process.cwd(), ".env.local") });

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const IMAGES_ROOT = path.resolve(process.cwd(), "scripts/seeds/images");

const MANIFEST_WHAT_IS_IT = path.resolve(
  process.cwd(),
  "scripts/seeds/what-is-it-images.json",
);
const MANIFEST_THEORY = path.resolve(
  process.cwd(),
  "scripts/seeds/theory-in-action-images.json",
);

function isImageFile(name: string): boolean {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

async function listFiles(dir: string): Promise<string[]> {
  let entries: { name: string; isFile: () => boolean }[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && isImageFile(e.name))
    .map((e) => path.join(dir, e.name));
}

function sortByNumericSuffix(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const na = parseInt(path.basename(a).replace(/\D/g, ""), 10) || 0;
    const nb = parseInt(path.basename(b).replace(/\D/g, ""), 10) || 0;
    return na - nb || a.localeCompare(b);
  });
}

async function collectWhatIsIt(): Promise<Map<string, string>> {
  const dir = path.join(IMAGES_ROOT, "what-is-it");
  const map = new Map<string, string>();
  for (const file of await listFiles(dir)) {
    const slug = path.basename(file, path.extname(file));
    map.set(slug, file);
  }
  return map;
}

async function collectTheoryInAction(): Promise<Map<string, string[]>> {
  const dir = path.join(IMAGES_ROOT, "theory-in-action");
  const map = new Map<string, string[]>();
  let entries: { name: string; isDirectory: () => boolean }[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return map;
  }

  for (const e of entries) {
    if (e.isDirectory()) {
      const slug = e.name;
      const files = sortByNumericSuffix(
        await listFiles(path.join(dir, slug)),
      );
      if (files.length) map.set(slug, files);
      continue;
    }
    if (!isImageFile(e.name)) continue;
    const base = path.basename(e.name, path.extname(e.name));
    const m = base.match(/^(.+)-(\d+)$/);
    if (!m) continue;
    const slug = m[1];
    const list = map.get(slug) ?? [];
    list.push(path.join(dir, e.name));
    map.set(slug, list);
  }

  for (const [slug, files] of map) {
    map.set(slug, sortByNumericSuffix(files));
  }
  return map;
}

async function collectIllustrations(): Promise<Map<string, string>> {
  const dir = path.join(IMAGES_ROOT, "illustrations");
  const map = new Map<string, string>();
  for (const file of await listFiles(dir)) {
    const slug = path.basename(file, path.extname(file));
    map.set(slug, file);
  }
  return map;
}

async function readJsonManifest(filePath: string): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const cf = loadCloudflareImagesConfig();

  if (!dryRun) {
    await verifyCloudflareImagesAuth(cf);
  }

  const whatIsIt = await collectWhatIsIt();
  const theory = await collectTheoryInAction();
  const illustrations = await collectIllustrations();

  const total =
    whatIsIt.size + [...theory.values()].reduce((n, f) => n + f.length, 0) + illustrations.size;

  if (total === 0) {
    console.log(
      "⚠  No images found under scripts/seeds/images/\n" +
        "   Add files, then run again. See scripts/seeds/images/README.md",
    );
    return;
  }

  const whatManifest = (await readJsonManifest(MANIFEST_WHAT_IS_IT)) as Record<
    string,
    string
  >;
  const theoryManifest = (await readJsonManifest(MANIFEST_THEORY)) as Record<
    string,
    string[]
  >;

  let uploaded = 0;
  let skipped = 0;

  for (const [slug, file] of whatIsIt) {
    if (whatManifest[slug] && !process.argv.includes("--force")) {
      console.log(`· what-is-it/${slug} (manifest has ID, use --force to re-upload)`);
      skipped++;
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] would upload what-is-it: ${slug} ← ${file}`);
      continue;
    }
    const { id } = await uploadImageFile(cf, file, {
      metadata: { slug, section: "what-is-it" },
    });
    whatManifest[slug] = id;
    console.log(`✓ what-is-it/${slug} → ${id}`);
    uploaded++;
  }

  for (const [slug, files] of theory) {
    const existing = theoryManifest[slug];
    if (existing?.length === files.length && !process.argv.includes("--force")) {
      console.log(`· theory-in-action/${slug} (${files.length} images in manifest)`);
      skipped++;
      continue;
    }
    const ids: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (dryRun) {
        console.log(`[dry-run] would upload theory-in-action: ${slug}/${i + 1} ← ${file}`);
        continue;
      }
      const { id } = await uploadImageFile(cf, file, {
        metadata: { slug, section: "theory-in-action", index: String(i + 1) },
      });
      ids.push(id);
      console.log(`✓ theory-in-action/${slug}/${i + 1} → ${id}`);
      uploaded++;
    }
    if (!dryRun && ids.length) theoryManifest[slug] = ids;
  }

  if (!dryRun) {
    await fs.writeFile(
      MANIFEST_WHAT_IS_IT,
      `${JSON.stringify(whatManifest, null, 2)}\n`,
    );
    await fs.writeFile(
      MANIFEST_THEORY,
      `${JSON.stringify(theoryManifest, null, 2)}\n`,
    );
  }

  console.log(
    `\nDone: ${uploaded} uploaded, ${skipped} skipped` +
      (dryRun ? " (dry-run)" : "") +
      "\nNext: pnpm seed:what-is-it-images && pnpm seed:theory-in-action-images",
  );

  if (illustrations.size > 0) {
    console.log(
      `\n⚠  Found ${illustrations.size} illustration(s) under images/illustrations/.` +
        " Card heroes use principles.illustration_url — apply via a separate step if needed.",
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
