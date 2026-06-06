-- Cloudflare Images IDs (or URLs) for each "Theory in Action" bullet, in display order.
-- Example: ["abc123", "def456"] for two examples.

alter table public.principles
  add column if not exists theory_in_action_image_urls jsonb;
