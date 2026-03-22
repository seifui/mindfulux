---
name: PostHog Analytics Setup
overview: Install PostHog, create the client/server singleton files and a `use client` providers wrapper, then update `app/layout.tsx` (the existing root layout) to wrap children in `<Providers>`.
todos:
  - id: install-deps
    content: "Run: npm install posthog-js posthog-node"
    status: completed
  - id: create-env
    content: Create .env.local with NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST
    status: completed
  - id: create-posthog-ts
    content: Create lib/posthog.ts — client-side singleton
    status: completed
  - id: create-posthog-server
    content: Create lib/posthog-server.ts — server-side getPostHogClient()
    status: completed
  - id: create-providers
    content: Create app/providers.tsx with PostHogProvider + PageViewTracker in Suspense
    status: completed
  - id: update-layout
    content: Update app/layout.tsx to wrap children in <Providers>
    status: completed
  - id: verify-files
    content: Display final contents of all 4 created/updated files for review
    status: completed
isProject: false
---

# PostHog Analytics Setup

## Scope adjustment

`app/[locale]/layout.tsx` does not exist — the root layout is `[app/layout.tsx](app/layout.tsx)`. All layout changes will be made there. The `next-intl` `NextIntlClientProvider` is not yet present, so the rule "do not move or change the existing NextIntlClientProvider" is a no-op for now.

## Install

```bash
npm install posthog-js posthog-node
```

## Environment variables — `.env.local` (new file)

```
NEXT_PUBLIC_POSTHOG_KEY=your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Files to create

### `lib/posthog.ts`

- Client-side singleton using `posthog-js`
- Guards against SSR with `typeof window !== 'undefined'`
- `capture_pageview: false` (manual tracking only)

### `lib/posthog-server.ts`

- Server-side client using `posthog-node`
- Exports `getPostHogClient()` for use in React Server Components

### `app/providers.tsx`

- `'use client'` component
- Wraps children with `PostHogProvider` from `posthog-js/react`
- Contains `PageViewTracker` (uses `usePathname` + `useSearchParams` to fire `$pageview` on route change)
- `PageViewTracker` wrapped in `<Suspense>` (required by Next.js 16 for `useSearchParams`)

## File to update

### `[app/layout.tsx](app/layout.tsx)`

- Import `Providers` from `./providers`
- Wrap `{children}` inside `<Providers>` within `<body>`

```tsx
// Before
<body className="min-h-full flex flex-col">{children}</body>

// After
<body className="min-h-full flex flex-col">
  <Providers>{children}</Providers>
</body>
```

## Verification (read-only, no dev server)

After creating files, display contents of all 4 files and confirm `.env.local` has the two keys.