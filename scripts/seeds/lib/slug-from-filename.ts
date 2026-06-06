/** Match slug rules in extract-and-seed.ts */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.pdf$/i, "");
  const deduped = withoutExt.replace(/\s*-\s*\d+$/, "");
  const spaced = deduped.replace(/[-_]+/g, " ");
  return spaced
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
