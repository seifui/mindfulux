# Principle access model

There is **no paid subscription**. Access is based on sign-in only.

| Visitor | Principles visible |
|---------|-------------------|
| Not signed in | First **30** (`principle_number` 1–30) |
| Signed in | All **150** |

## How it works

- Anonymous users see 30 principles on the listing, home carousels, and search.
- After sign-up or sign-in, the session unlocks the full catalogue automatically.
- No manual upgrades or `user_tier` changes are required.

The `profiles` table still exists for future features (e.g. bookmarks or billing), but gating does not use `user_tier` today.
