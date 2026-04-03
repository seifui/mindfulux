-- Book launch waitlist
create table if not exists public.book_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint book_waitlist_email_unique unique (email)
);

alter table public.book_waitlist enable row level security;

-- Server uses service role; no public policies required for anonymous insert via API

-- Principles (published catalogue)
create table if not exists public.principles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  illustration_url text,
  published boolean not null default false,
  is_preview boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.principles enable row level security;

-- Optional seed for local dev (idempotent)
insert into public.principles (slug, title, description, published, is_preview)
values
  (
    'fitts-law',
    'Fitts''s Law',
    'The time to acquire a target is a function of the distance to and size of the target. Larger, closer interactive elements are faster to reach.',
    true,
    true
  ),
  (
    'hicks-law',
    'Hick''s Law',
    'The time it takes to make a decision grows with the number of choices. Reducing options at critical moments speeds up decisions.',
    true,
    true
  )
on conflict (slug) do nothing;
