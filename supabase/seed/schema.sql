-- =============================================================================
-- MindfulUX — complete Supabase public schema
-- =============================================================================
-- Consolidated from supabase/migrations/* and application code.
-- Safe to run on a fresh Supabase project (empty public schema).
--
-- Column naming in the app (not *_en suffixes):
--   title, description, illustration_url (not title_en / image_url)
--
-- Access model (principles RLS):
--   Anonymous  → published rows with principle_number <= 30
--   Signed in  → published rows with principle_number <= 150
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
-- gen_random_uuid(), tsvector, and GIN indexes are built-in on Supabase PG 15+.
-- No extensions required for this schema.

-- ---------------------------------------------------------------------------
-- 2. TABLES
-- ---------------------------------------------------------------------------

-- Book launch waitlist (written via service role in /api/notify-book)
create table public.book_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint book_waitlist_email_unique unique (email)
);

-- UX principles catalogue
create table public.principles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  description text,
  illustration_url text,
  published boolean not null default false,
  is_preview boolean not null default true,
  created_at timestamptz not null default now(),
  principle_number integer not null,
  what_is_it text,
  history text,
  psychology_behind text,
  why_it_matters text,
  how_to_apply text,
  theory_in_action text,
  final_thought text,
  category text default 'ux-psychology',
  what_is_it_image_url text,
  theory_in_action_image_urls jsonb,
  home_section text,
  search_vector tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(what_is_it, '') || ' ' ||
      coalesce(history, '') || ' ' ||
      coalesce(psychology_behind, '') || ' ' ||
      coalesce(why_it_matters, '') || ' ' ||
      coalesce(how_to_apply, '')
    )
  ) stored,
  constraint principles_slug_key unique (slug),
  constraint principles_home_section_check
    check (home_section is null or home_section in ('a', 'b', 'c'))
);

comment on column public.principles.principle_number is
  'Simple row counter (1, 2, 3…). Assigned by created_at order via pnpm seed:numbers.';

comment on column public.principles.what_is_it_image_url is
  'Optional Cloudflare Images ID (or URL/path) for the "What Is It?" section diagram.';

comment on column public.principles.theory_in_action_image_urls is
  'Cloudflare Images IDs (or URLs) for each "Theory in Action" bullet, in display order.';

comment on column public.principles.home_section is
  'Which homepage carousel (A/B/C) this row belongs to; null = not shown in those sections.';

-- Authenticated user profiles (auto-created on signup)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_tier integer not null default 2 check (user_tier in (2, 3)),
  created_at timestamptz not null default now()
);

comment on column public.profiles.user_tier is
  '2 = free signed-in user (default on signup). 3 = manual subscriber upgrade (future use).';

-- Community newsletter sign-ups (written via service role in /api/newsletter)
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  source text,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_unique unique (email)
);

-- ---------------------------------------------------------------------------
-- 3. INDEXES
-- ---------------------------------------------------------------------------

create unique index principles_principle_number_key
  on public.principles (principle_number);

create index principles_search_idx
  on public.principles using gin (search_vector);

create index principles_published_home_section_idx
  on public.principles (home_section)
  where published = true and home_section is not null;

-- ---------------------------------------------------------------------------
-- 4. FUNCTIONS
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_tier)
  values (new.id, 2)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. TRIGGERS
-- ---------------------------------------------------------------------------

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY + POLICIES
-- ---------------------------------------------------------------------------

alter table public.book_waitlist enable row level security;
-- No public policies: inserts go through service role in /api/notify-book.

alter table public.principles enable row level security;

create policy "Public read first 30 principles"
  on public.principles for select
  using (published = true and principle_number <= 30);

create policy "Signed in users read all principles"
  on public.principles for select
  using (
    published = true
    and auth.uid() is not null
    and principle_number <= 150
  );

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

alter table public.newsletter_subscribers enable row level security;

create policy "Public can insert newsletter subscribers"
  on public.newsletter_subscribers for insert
  with check (true);
