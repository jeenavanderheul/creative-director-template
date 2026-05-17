# DESIGN SYSTEM: BRUTALIST EDITORIAL

Single source of truth for typography, color, spacing, motion, and structure. Mirrors what ships in [src/index.css](src/index.css) and [src/lib/motion.ts](src/lib/motion.ts). When code and this doc disagree, fix the code OR fix this doc — never let them drift.

## FONT SPECIFICATION

**PRIMARY:** Geist Sans (variable WOFF2, weights 100–900)
**MONO:** Geist Mono
**FALLBACKS (sans):** Helvetica Neue, Helvetica, Arial, ui-sans-serif, system-ui, sans-serif
**FALLBACKS (mono):** ui-monospace, monospace

Loaded via `@font-face` with `font-display: swap`. Always reference via the CSS token `var(--font-sans)` or `var(--font-mono)` — never hardcode the family name.

## TYPOGRAPHIC HIERARCHY

All display heads are uppercase. Sizes use `clamp()` for fluid scaling.

### H1 / DISPLAY
- Weight: 400 (regular)
- Size: `clamp(2.5rem, 10vw, 7.2rem)` → 40–115px
- Line-height: 0.9
- Tracking: `tracking-tighter` (-0.05em)
- Wrap: `text-wrap: balance`
- Usage: hero headlines, page titles

### H2 / SECTION
- Weight: 400 (regular)
- Size: `clamp(1.5rem, 6vw, 4rem)` → 24–64px
- Line-height: 1.0
- Tracking: `tracking-tight` (-0.025em)
- Wrap: `text-wrap: balance`
- Usage: section titles. Use utility `.text-huge` to give an h2 the same scale as h1.

### H3 / SUBHEAD
- Weight: 700 (bold)
- Size: `text-lg md:text-xl` → 18px / 20px
- Tracking: `tracking-tight`
- Case: sentence case
- Usage: feature titles, column headers, case-block titles

### BODY (p)
- Weight: 400 (regular)
- Size: 16px (`text-base`)
- Line-height: 1.5
- Wrap: `text-pretty`
- Usage: descriptive text, paragraphs

### MICRO / LABEL (`.text-micro`)
- Weight: 700 (bold)
- Size: `clamp(0.625rem, 1.5vw, 0.75rem)` → 10–12px
- Tracking: `tracking-[0.1em]`
- Case: uppercase
- Usage: metadata, numeric labels, section eyebrows

## COLOR PALETTE

**Light mode**
- Ink: `#000000` (text)
- Paper: `#FFFFFF` (background)
- Subtle: `#F5F5F5` (cards/borders, when used)

**Dark mode**
- Paper: `#0a0a0a` (background, slightly off-black to soften the noise overlay)
- Ink: `#FFFFFF` (text)
- Borders: `neutral-800`

**Greys (Tailwind tokens used)**
- Body paragraphs: `text-neutral-600 dark:text-neutral-300`
- Micro labels: `text-neutral-500`
- Borders: `border-neutral-200 dark:border-neutral-800`

## TEXTURE

`body::after` overlay — 8% opacity SVG fractal-noise — applied site-wide. Adds editorial grain without obscuring text.

## GRID & STRUCTURE

- Columns: 12 desktop / 1 mobile collapse via `md:grid-cols-12`
- Container: `mx-auto max-w-[75vw] md:max-w-7xl`
- Section padding (hero): `pt-[12vh] sm:pt-[16vh] pb-32`
- Section padding (secondary): `py-24 md:py-32`
- Page horizontal padding: `px-8 md:px-12 lg:px-24`
- Borders: 0.5–1px stroke (`border-thin` utility for 0.5px)
- Gutter: 0 by default — separation via `border-` lines

## SPACING SCALE

Tailwind defaults (4px base). Common rhythm values used throughout:
- Tight: `gap-3`, `mb-4`
- Standard: `gap-8`, `mb-8`, `gap-12`
- Loose: `gap-24`, `mb-24`
- Section: `py-24 md:py-32`
- Hero: `pt-[12vh] sm:pt-[16vh] pb-32`

## MOTION

Tokens in [src/lib/motion.ts](src/lib/motion.ts). Never inline ease arrays.

| Token | Value | Use |
|---|---|---|
| `EASE_STANDARD` | `[0.215, 0.61, 0.355, 1]` | Reveals, scroll-in, page transitions |
| `EASE_SNAPPY` | `[0.32, 0.72, 0, 1]` | Menu/carousel interactions |
| `EASE_GENTLE` | `[0.22, 1, 0.36, 1]` | Lightboxes, overlays |
| `DUR_FAST` | `0.25s` | Quick UI feedback |
| `DUR_BASE` | `0.4s` | Standard transitions |
| `DUR_SLOW` | `0.7s` | Reveals, slow fades |
| `DUR_HERO` | `1.5s` | Hero entrance |

`prefers-reduced-motion` is respected globally — all `transition-duration` and `animation-iteration-count` clamped to near-zero when set.

## ACCESSIBILITY

- `:focus-visible` ring: 2px solid currentColor, offset 4px
- Touch targets: 44×44 px minimum (`.touch-target` utility)
- Safe-area insets handled in `body` padding via `env(safe-area-inset-*)`
- Reduced motion enforced via media query
- Scrollbar hidden globally — a known accessibility tradeoff for editorial composition (revisit if user feedback surfaces)

## RESILIENCE

WebGL-dependent components (`MorphingSystem`, `Model3D`, `Carousel`) are wrapped in [`<ErrorBoundary>`](src/components/ErrorBoundary.tsx). When WebGL is unavailable (low-end devices, sandboxed browsers), the component falls back to `null` and the rest of the page renders normally.

## RESPONSIVE BREAKPOINTS

| Token | Width |
|---|---|
| `xs` | 380px (custom, mobile-large) |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
