-- Two-tier access: anonymous sees 30 principles, signed-in users see all 150.

drop policy if exists "Public read tier 1 principles" on public.principles;
drop policy if exists "Users read principles up to tier" on public.principles;

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
