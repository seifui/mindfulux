-- Extends public.principles with long-form section content from PDF extractions.
-- The base table was created in 20260328130000_book_waitlist_principles.sql.
-- This migration adds the seven structured sections, a category label,
-- a generated full-text-search column, a GIN index, and a public SELECT policy.

alter table public.principles
  add column if not exists what_is_it       text,
  add column if not exists history          text,
  add column if not exists psychology_behind text,
  add column if not exists why_it_matters   text,
  add column if not exists how_to_apply     text,
  add column if not exists theory_in_action text,
  add column if not exists final_thought    text,
  add column if not exists category         text default 'ux-psychology';

-- Generated FTS column (depends on columns added above, so must be a separate statement).
alter table public.principles
  add column if not exists search_vector tsvector
    generated always as (
      to_tsvector(
        'english',
        coalesce(title,             '') || ' ' ||
        coalesce(what_is_it,        '') || ' ' ||
        coalesce(history,           '') || ' ' ||
        coalesce(psychology_behind, '') || ' ' ||
        coalesce(why_it_matters,    '') || ' ' ||
        coalesce(how_to_apply,      '')
      )
    ) stored;

create index if not exists principles_search_idx
  on public.principles using gin (search_vector);

-- Allow anonymous/public reads via the Supabase anon key.
-- RLS is already enabled on this table; no SELECT policy existed before.
drop policy if exists "Public can read principles" on public.principles;
create policy "Public can read principles"
  on public.principles for select using (true);
