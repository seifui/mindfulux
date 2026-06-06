-- Catalog order: 1, 2, 3… for book / listing display.

alter table public.principles
  add column if not exists principle_number integer;

with numbered as (
  select id, row_number() over (order by created_at asc, id asc) as rn
  from public.principles
)
update public.principles p
set principle_number = n.rn
from numbered n
where p.id = n.id
  and p.principle_number is distinct from n.rn;

alter table public.principles
  alter column principle_number set not null;

create unique index if not exists principles_principle_number_key
  on public.principles (principle_number);

comment on column public.principles.principle_number is
  'Simple row counter (1, 2, 3…). Assigned by created_at order via pnpm seed:numbers.';
