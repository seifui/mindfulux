/**
 * Verify CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_IMAGES_TOKEN can access Cloudflare Images.
 * Run: pnpm seed:verify-cloudflare
 */
import { config } from "dotenv";
import path from "node:path";
import {
  loadCloudflareImagesConfig,
  verifyCloudflareImagesAuth,
} from "./lib/cloudflare-images-api";

config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const cf = loadCloudflareImagesConfig();
  await verifyCloudflareImagesAuth(cf);
  const hash =
    process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH?.trim() ||
    process.env.CLOUDFLARE_IMAGES_HASH?.trim();
  console.log("✓ Cloudflare Images API auth OK");
  if (!hash) {
    console.warn(
      "⚠  Set NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH (delivery hash from Images dashboard)",
    );
  } else {
    console.log(`✓ Delivery hash configured (${hash.slice(0, 6)}…)`);
  }
}

main().catch((err) => {
  console.error(`✗ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
