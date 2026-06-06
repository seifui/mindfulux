import fs from "node:fs/promises";
import pdf from "pdf-parse";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: parse-pdf-once.ts <absolute-pdf-path>");
    process.exit(2);
  }

  const buffer = await fs.readFile(filePath);
  const parsed = await pdf(buffer);
  process.stdout.write(JSON.stringify({ text: parsed.text }));
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
