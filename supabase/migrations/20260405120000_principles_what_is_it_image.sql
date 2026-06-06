-- Optional Cloudflare Images ID (or URL/path) for the "What Is It?" section diagram.

alter table public.principles
  add column if not exists what_is_it_image_url text;
