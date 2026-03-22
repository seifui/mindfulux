---
name: Figma Design Tokens Extraction
overview: Extract all design tokens from the MindfulUX Figma file (colors, typography, spacing, radius, shadows) and produce a complete tailwind.config.ts and globals.css with CSS variables mapped to Shadcn/UI theme tokens for both light and dark modes.
todos: []
isProject: false
---

# Figma Design Tokens Extraction Plan

This plan documents the exact design tokens extracted from the [MindfulUX Growth Website](https://www.figma.com/design/C1bBDDALTB6cq6Ct6t43il/MindfulUX-Growth-Website-2025?node-id=4566-1396) Figma file and specifies the output artifacts.

---

## 1. Colors (Exact Figma Values)

All values come from Figma variables and inline styles in the generated design context.


| Token Name        | Hex/RGBA                               | Usage                                                                    |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| **cream**         | `#eee8e1`                              | Page background (Sunken/App main backgrounds)                            |
| **ink**           | `rgba(24,28,32,0.9)` / `#181c20e5`     | Headings, primary text (text-gray-800)                                   |
| **muted**         | `rgba(6,26,64,0.6)` / `#061a4099`      | Placeholder, muted text (text-gray-500)                                  |
| **accent**        | `#b68973`                              | Brand terracotta - "AI skills", active nav, search button (bg-brand-600) |
| **brand-dark**    | `#4f4040`                              | Logo text (text-brand-700)                                               |
| **lavender**      | `#d5d4e2`                              | Community promo card background (inline)                                 |
| **tan**           | `#decfc4`                              | Book promo card background (inline)                                      |
| **card**          | `rgba(182,137,115,0.14)` / `#b6897324` | Skill card background (bg-brand-100)                                     |
| **input**         | `rgba(31,53,97,0.04)` / `#1f35610a`    | Search bar, newsletter input (bg-gray-50)                                |
| **border**        | `rgba(31,53,97,0.16)` / `#1f356129`    | Card borders, icon buttons (border-gray-300)                             |
| **border-strong** | `rgba(0,13,33,0.8)` / `#000d21cc`      | Pill button outline (border-gray-700)                                    |
| **ink-secondary** | `rgba(0,13,33,0.8)` / `#000d21cc`      | Button text (text-gray-700)                                              |
| **white**         | `#ffffff`                              | Icons on accent (icon-white)                                             |
| **transparent**   | `#ffffff00`                            | Transparent fills                                                        |


---

## 2. Typography (Exact Figma Values)

**Font families and text styles:**


| Style              | Family            | Weight         | Size    | Line-height | Letter-spacing |
| ------------------ | ----------------- | -------------- | ------- | ----------- | -------------- |
| Secondary large    | Clash Display     | 600 (Semibold) | 72px    | 1           | -3px           |
| Secondary Medium   | Clash Display     | 600            | 36px    | 1           | 0              |
| Secondary small    | Clash Display     | 600            | 32px    | 1           | 0              |
| Text base Bold     | Inter             | 700            | 16px    | 24px        | -0.32px (-2)   |
| Text base Semibold | Inter             | 600            | 16px    | 24px        | -0.32px        |
| Text base Medium   | Inter             | 500            | 16px    | 24px        | -0.32px        |
| Text sm Semibold   | Inter             | 600            | 14px    | 20px        | -0.28px        |
| Card title         | Inter             | 500            | 20px    | 1.3         | -0.4px         |
| Sinhala body       | Noto Sans Sinhala | 500            | 12px    | 1.75        | -0.24px        |
| Logo               | Clash Display     | 600            | 28.95px | 1           | -0.87px        |


---

## 3. Border Radius, Spacing, Shadows

**Border radius:**

- `12px` - Skill cards, image containers
- `20px` - Promo cards (Book, Community)
- `9999px` - Pills (search bar, icon buttons, newsletter inputs)

**Spacing (from Figma variables):**

- `0`, `2px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`, `20px`, `24px`, `30px`, `40px`, `48px`, `80px`
- Card padding: `24px`
- Promo card padding: `48px`
- Section gaps: `30px`, `40px`, `80px`
- Card gap: `20px`

**Shadows:**

- Book mockup shadow (only explicit shadow in design): `3.772px 9.429px 7.287px 0px rgba(1,1,1,0.15)`
- Promo cards: Design description mentions "soft, diffused drop shadows" but no exact Figma variable/export value. Omit or add a soft shadow token based on the book shadow pattern.

---

## 4. Implementation Notes

**Tailwind v4:** The project uses Tailwind v4 with `@theme inline` in [app/globals.css](app/globals.css). There is no `tailwind.config.ts` (components.json has `"config": ""`). Tailwind v4 is CSS-first and does not use a JS config by default.

**Two output formats will be produced:**

1. **tailwind.config.ts** - A complete JS config file with all tokens. This can serve as:
  - Reference documentation
  - A compatibility layer if Tailwind v3 is used
  - Source of truth for token names
2. **globals.css** - Updated with:
  - `:root` (light) - All Shadcn theme variables mapped to Figma values
  - `.dark` - Dark mode variants (inverted/adjusted for contrast)
  - Existing `@theme inline` block extended with new custom tokens

**Shadcn theme variable mapping (from [app/globals.css](app/globals.css)):**


| Shadcn Var           | Light (Figma)                | Dark         |
| -------------------- | ---------------------------- | ------------ |
| --background         | cream #eee8e1                | darker base  |
| --foreground         | ink #181c20e5                | cream        |
| --card               | white/cream tint             | card-dark    |
| --card-foreground    | ink                          | cream        |
| --primary            | accent #b68973               | accent-light |
| --primary-foreground | white                        | brand-dark   |
| --secondary          | card #b6897324               | muted        |
| --muted              | input #1f35610a              | muted-dark   |
| --muted-foreground   | muted #061a4099              | muted-light  |
| --accent             | card                         | accent-dark  |
| --border             | border #1f356129             | border-dark  |
| --input              | border                       | input-dark   |
| --ring               | accent                       | accent       |
| --radius             | 12px (card) or 0.625rem base | same         |


---

## 5. Font Loading

**Clash Display** - Not a system font. Add via `next/font` or Google Fonts (if available) or local font files.

**Noto Sans Sinhala** - Google Font. Load for Sinhala body text.

**Inter** - System/Google Font, typically already available.

---

## 6. Output File Structure

```
tailwind.config.ts          <- NEW: Full token config (reference/compat)
app/globals.css             <- UPDATED: CSS vars + @theme extensions
```

The `tailwind.config.ts` will use the `theme.extend` pattern. For Tailwind v4 projects, the actual theming will live in the `@theme` block and `:root`/`.dark` CSS variables in `globals.css`.