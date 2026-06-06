# Auth + tier gating launch checklist

## Before deploy

- [ ] Apply Supabase migrations: `supabase db push` (includes `profiles` + 30/150 RLS)
- [ ] Supabase Auth → URL configuration: add `https://<your-domain>/auth/callback` and `http://localhost:3000/auth/callback`
- [ ] Enable Email provider in Supabase Auth
- [ ] Enable Google provider in Supabase Auth (Google Cloud OAuth client → add redirect `https://<project-ref>.supabase.co/auth/v1/callback` → paste Client ID/Secret in Supabase)
- [ ] Set `NEXT_PUBLIC_SITE_URL` in Vercel for sitemap/robots
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is **not** prefixed with `NEXT_PUBLIC_`

## Security verification

- [ ] Anonymous user cannot read `principle_number > 30` via anon key
- [ ] Signed-in user can read all 150 principles
- [ ] Direct URL to a locked slug (31+) as anonymous → upgrade wall, not full article
- [ ] Search API returns only tier-visible principles for the current session

## Happy path (UI)

- [ ] Incognito → `/principles` shows **30 of 150** + locked teaser
- [ ] Sign up at `/login` → `/principles` shows **150 of 150**, no locked teaser
- [ ] Sign in with Google at `/login` → redirects to `/principles` signed in
- [ ] Sign out → back to **30 of 150**
- [ ] EN and SI locales on login and upgrade CTAs

## SEO

- [ ] `/sitemap.xml` lists static routes + all principle slugs
- [ ] `/robots.txt` allows crawling
