-- Homepage A/B/C buckets: assign principles explicitly instead of inferring from title prefix.

alter table public.principles
  add column if not exists home_section text;

alter table public.principles
  drop constraint if exists principles_home_section_check;

alter table public.principles
  add constraint principles_home_section_check
  check (home_section is null or home_section in ('a', 'b', 'c'));

create index if not exists principles_published_home_section_idx
  on public.principles (home_section)
  where published = true and home_section is not null;

comment on column public.principles.home_section is
  'Which homepage carousel (A/B/C) this row belongs to; null = not shown in those sections.';
