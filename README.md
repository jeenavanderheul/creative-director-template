# Creative Director Portfolio Template

A downloadable, public-safe template of a brutalist editorial creative director portfolio.
Clone, replace the placeholder media, rewrite the parody copy, and ship.

## What's inside

- **React 19 + TypeScript** with Vite 6
- **Tailwind CSS v4** (in-CSS config via `@theme`)
- **Three.js** 3D head + morphing system
- **GSAP** + **Motion** animations
- Custom kinetic typography (scramble, typewriter, swap)
- Site-wide HUD elements (corner brackets, segmented progress bars)
- Dark/light theme with prefers-color-scheme detection
- Fully responsive — works iPhone SE → 4K desktop

## Routes

| Route | What |
|---|---|
| `/` | Hero + system diagram |
| `/work` | Case study grid + list view |
| `/work/erased-font` | Sample case study layout |
| `/about` | Bio + principles + mantra |
| `/ai-systems` | Experiment carousel + workflows grid |
| `/play` | Free-form canvas / video wall |

## Getting started

```bash
npm install
npm run dev      # opens http://localhost:3000
npm run build    # production build to /dist
npm run preview  # preview production build
npm run lint     # tsc --noEmit
```

## Replace the placeholder content

Everything personal has been stripped. To make this your own:

### Images
All images point to `/placeholders/image.svg` (gray "REPLACE IMAGE" block).
Search the codebase for `/placeholders/image.svg` and swap with your assets.

### Videos
All video references point to `/placeholders/video.svg` (dark "REPLACE VIDEO" block).
External Vimeo embeds use a neutralized placeholder URL.

### Copy
All visible copy uses parody agency-speak. Files to edit:
- `src/App.tsx` — hero, system diagram, body copy
- `src/pages/AISystemsPage.tsx` — experiment titles + case blocks
- `src/pages/AboutPage.tsx` — bio + principles
- `src/pages/WorkPage.tsx` — case studies metadata
- `src/pages/ErasedFontCasePage.tsx` — sample case page
- `src/pages/PlayPage.tsx` — canvas items

### Personal details
- `index.html` — meta tags, OG image, theme color
- `public/site.webmanifest` — app name + theme
- `public/sitemap.xml` + `public/robots.txt` — domain references
- `src/components/Navbar.tsx` — name + social links
- `src/components/Footer.tsx` — name + social links

## Configuration

Copy `.env.template` to `.env` and fill in your own keys if you wire up
analytics, contact forms, or third-party APIs:

```bash
cp .env.template .env
```

The template includes example env names but no actual values — bring your own.

## Tech notes

- Tailwind v4 config lives in `src/index.css` under `@theme`
- Animations respect `prefers-reduced-motion`
- Routes use `react-router-dom` v7 + lazy loading
- 3D components wrapped in `ErrorBoundary` + `Suspense` for graceful fallback

## License

MIT — free to fork, ship, modify, sell, claim as your own.
Attribution appreciated but not required.

---

*Built as a public-safe export of a personal portfolio. All sensitive data,
real client names, personal media, and proprietary copy have been replaced
with placeholders or satirical parody content.*
