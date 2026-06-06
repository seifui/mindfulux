import fs from "node:fs/promises";
import path from "node:path";

export type CloudflareImagesConfig = {
  accountId: string;
  token: string;
};

export function loadCloudflareImagesConfig(): CloudflareImagesConfig {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token =
    process.env.CLOUDFLARE_IMAGES_TOKEN?.trim() ||
    process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !token) {
    throw new Error(
      "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_IMAGES_TOKEN (or CLOUDFLARE_API_TOKEN) in .env.local — token needs Account → Cloudflare Images → Edit.",
    );
  }
  return { accountId, token };
}

export type UploadImageOptions = {
  /** Stored in Cloudflare image metadata (searchable in dashboard). */
  metadata?: Record<string, string>;
  /** Optional custom ID (must be unique). */
  id?: string;
};

export type UploadImageResult = {
  id: string;
  filename: string;
};

/** Upload a local image file to Cloudflare Images. Returns the image ID. */
export async function uploadImageFile(
  config: CloudflareImagesConfig,
  filePath: string,
  options?: UploadImageOptions,
): Promise<UploadImageResult> {
  const buffer = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "application/octet-stream";

  const form = new FormData();
  const blob = new Blob([buffer], { type: mime });
  form.append("file", blob, path.basename(filePath));
  if (options?.metadata && Object.keys(options.metadata).length > 0) {
    form.append("metadata", JSON.stringify(options.metadata));
  }
  if (options?.id) {
    form.append("id", options.id);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}` },
    body: form,
  });

  const json = (await res.json()) as {
    success: boolean;
    errors?: { message: string }[];
    result?: { id: string; filename: string };
  };

  if (!res.ok || !json.success || !json.result?.id) {
    const msg =
      json.errors?.map((e) => e.message).join("; ") ||
      `HTTP ${res.status} uploading ${filePath}`;
    throw new Error(msg);
  }

  return { id: json.result.id, filename: json.result.filename };
}

/** Quick auth check before batch uploads. */
export async function verifyCloudflareImagesAuth(
  config: CloudflareImagesConfig,
): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v2?per_page=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.token}` },
  });
  const json = (await res.json()) as {
    success: boolean;
    errors?: { message: string }[];
  };
  if (!json.success) {
    throw new Error(
      json.errors?.map((e) => e.message).join("; ") ||
        `Cloudflare Images auth failed (HTTP ${res.status}). Regenerate CLOUDFLARE_IMAGES_TOKEN with Images Edit permission.`,
    );
  }
}
