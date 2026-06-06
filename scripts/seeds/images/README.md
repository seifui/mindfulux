# Principle section images

Place exported PNG/JPG/WebP files here, then upload to Cloudflare:

```bash
pnpm seed:verify-cloudflare   # check API token before uploading
pnpm seed:migrate:images      # once: add DB columns (needs SUPABASE_DB_URL, or run SQL below)
pnpm seed:upload-images       # upload → writes manifests
pnpm seed:what-is-it-images   # sync What Is It? IDs to Supabase
pnpm seed:theory-in-action-images
```

If `seed:migrate:images` fails, run this in the [Supabase SQL editor](https://supabase.com/dashboard):

```sql
alter table public.principles
  add column if not exists what_is_it_image_url text;

alter table public.principles
  add column if not exists theory_in_action_image_urls jsonb;
```

## Folder layout

| Path | Maps to |
|------|---------|
| `what-is-it/{slug}.png` | `principles.what_is_it_image_url` (one diagram) |
| `theory-in-action/{slug}/1.png`, `2.png`, … | `principles.theory_in_action_image_urls` (ordered array) |
| `theory-in-action/{slug}-1.png`, `{slug}-2.png` | Same (flat alternative) |
| `illustrations/{slug}.png` | Card hero (`illustration_url`) — not auto-applied yet |

`{slug}` must match the principle slug in Supabase (same as PDF seed), e.g. `fitts-law`, `halo-effect`.

## Cloudflare credentials (`.env.local`)

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_IMAGES_TOKEN` — API token with **Account → Cloudflare Images → Edit**
- `NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH` — delivery hash from the Images dashboard

If upload returns `Authentication error`, create a new token with Images Edit permission.

## Flags

- `pnpm seed:upload-images --dry-run` — list files without uploading
- `pnpm seed:upload-images --force` — re-upload even when manifest already has IDs
