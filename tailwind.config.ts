/**
 * MindfulUX Design Token Reference
 *
 * Extracted from:
 * https://www.figma.com/design/C1bBDDALTB6cq6Ct6t43il/MindfulUX-Growth-Website-2025?node-id=4566-1396
 *
 * This project uses Tailwind v4 (CSS-first). All active tokens are configured
 * in app/globals.css via @theme, :root, and .dark blocks.
 *
 * To activate this config as an additional token layer in Tailwind v4, add:
 *   @config "../tailwind.config.ts"
 * to app/globals.css (after the @import statements; path is relative to app/).
 *
 * Token source key:
 *   Figma variable path shown in parentheses, e.g. (Colors/Background/bg-brand-600)
 */
import type { Config } from "tailwindcss";

const config = {
  darkMode: "class" as const,
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Colors ─────────────────────────────────────────────────────────────
      colors: {
        // Page & surface backgrounds
        cream: "#eee8e1",             // Page background        (Colors/App main backgrounds/Sunken)
        lavender: "#d5d4e2",          // Community promo card   (inline bg on Frame 1112)
        tan: "#decfc4",               // Book promo card        (inline bg on Frame 1113)
        "card-fill": "rgba(182, 137, 115, 0.14)", // Legacy tint (Colors/Background/bg-brand-100)
        "featured-strip": "var(--featured-strip)", // Featured skills full-bleed band (~#f2ece4)
        "skill-card": "var(--skill-card)", // Skill card surface (~#e8e0d5)
        "skill-well": "var(--skill-well)", // Illustration inset (warm off-white)
        "input-fill": "rgba(31, 53, 97, 0.04)",   // Search bar + newsletter inputs (Colors/Background/bg-gray-50)

        // Text
        ink: "rgba(24, 28, 32, 0.9)",             // Headings, primary text (Colors/Text/text-gray-800)
        "ink-secondary": "rgba(0, 13, 33, 0.8)",  // Button labels         (Colors/Text/text-gray-700)
        "muted-text": "rgba(6, 26, 64, 0.6)",     // Placeholders, muted body (Colors/Text/text-gray-500)

        // Brand accent
        accent: {
          DEFAULT: "#b68973", // Terracotta — "AI skills" span, active nav link, search icon button bg
                              // (Colors/Background/bg-brand-600, Colors/Text/text-brand-600,
                              //  Colors/Icon/icon-brand-600)
          dark: "#4f4040",    // Logo wordmark, dark brand variant
                              // (Colors/Text/text-brand-700, Colors/Background/bg-brand-700)
        },

        // Borders
        "border-subtle": "rgba(31, 53, 97, 0.16)", // Icon button outlines, card edges (Colors/Border/border-gray-300)
        "border-strong": "rgba(0, 13, 33, 0.8)",   // Pill button outlines             (Colors/Border/border-gray-700)

        // Utility
        white: "#ffffff", // Icon-on-accent fill (Colors/Icon/icon-white)
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        // Clash Display — loaded via next/font/local in app/layout.tsx (--font-display)
        display: ["var(--font-display)", "sans-serif"],
        // Inter — loaded via next/font/google in app/layout.tsx (--font-body)
        sans: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
        // Noto Sans Sinhala — Sinhala-script card body text
        sinhala: ["var(--font-sinhala)", "Noto Sans Sinhala", "sans-serif"],
      },

      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight? }]

        // 12px — Sinhala body text on skill cards (Noto Sans Sinhala Medium)
        "2xs": ["12px", { lineHeight: "1.75", letterSpacing: "-0.24px" }],

        // 14px — Button labels, pill text  (Text sm/Semibold: Inter 600)
        sm: ["14px", { lineHeight: "20px", letterSpacing: "-0.28px" }],

        // 16px — Nav links, body copy, card descriptions  (Text base/*: Inter 500/600/700)
        base: ["16px", { lineHeight: "24px", letterSpacing: "-0.32px" }],

        // 20px — Skill card titles  (Inter Medium)
        xl: ["20px", { lineHeight: "1.3", letterSpacing: "-0.4px" }],

        // 28.95px — Navbar brand logo  (Clash Display Semibold)
        logo: ["28.95px", { lineHeight: "1", letterSpacing: "-0.87px" }],

        // 32px — Section headings (Featured skills, Section name)  (Secondary small)
        "2xl": ["32px", { lineHeight: "1", letterSpacing: "0" }],

        // 36px — Footer CTA heading  (Secondary Medium)
        "3xl": ["36px", { lineHeight: "1", letterSpacing: "0" }],

        // 72px — Hero headline "Discover awesome Product principles..."  (Secondary large)
        hero: ["72px", { lineHeight: "1", letterSpacing: "-3px" }],

        // Principle detail page type scale (Figma node 4648:2332)
        "detail-title": ["clamp(2.5rem, 5vw, 3.875rem)", { lineHeight: "1" }], // ~62px desktop
        "detail-tagline": ["24px", { lineHeight: "32px", letterSpacing: "-0.48px" }], // Figma node 4648:2344
        "detail-heading": ["30px", { lineHeight: "38px" }], // Section headings (What Is It?, etc.)
      },

      fontWeight: {
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // ── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        card: "12px",         // General UI cards
        skill: "16px",        // Featured skills cards (Figma)
        "skill-well": "12px", // Illustration inset
        promo: "40px",        // Book & Community promo cards (Figma 4573-1596; was Frame 1112/1113)
        pill: "9999px",       // Search bar, newsletter inputs, icon buttons (rounded-full)
        illustration: "1.25rem", // 20px — principle detail hero image (Figma node 4648:2484)
      },

      // ── Spacing ─────────────────────────────────────────────────────────────
      // Figma gap/padding tokens (supplements Tailwind's default numeric scale)
      spacing: {
        "0.5": "2px",   // spacing-xxs
        "1.5": "6px",   // gap-1.5
        "3.5": "14px",  // gap-3.5
        "7.5": "30px",  // section sub-gap (heading ↔ card row)
        "20": "80px",   // outer section gap
      },

      // ── Layout ──────────────────────────────────────────────────────────────
      // Main column width — Figma navbar / page inner (node 4566-1397): 1305px
      maxWidth: {
        page: "1305px",
        content: "42.5rem", // 680px — principle detail page article column (Figma node 4648:2332)
      },

      // ── Shadows ─────────────────────────────────────────────────────────────
      boxShadow: {
        // Promo card ambient lift (inferred from design description)
        promo: "0 8px 24px 0 rgba(79, 64, 64, 0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
