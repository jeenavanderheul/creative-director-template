# Maximilian Portfolio

Creative Director portfolio website. Brutalist editorial design system.

## Tech Stack

- React 19 + TypeScript
- Vite 6 (build tool)
- Tailwind CSS v4 (via @tailwindcss/vite plugin, config in index.css @theme)
- Three.js (3D morphing shapes on homepage)
- GSAP (3D carousel on case study pages)
- Motion/Framer Motion (page transitions, scroll animations)
- Lucide React (icons)
- React Router DOM v7 (routing)

## File Structure

```
src/
  App.tsx              # Router config + HomePage component
  main.tsx             # React 19 entry point with BrowserRouter
  index.css            # Tailwind imports, @theme config, base styles, utilities
  components/
    Navbar.tsx          # Fixed nav with theme support (light/dark)
    MorphingSystem.tsx  # Three.js 3D morphing shapes (hero section)
    RingCarousel.tsx    # GSAP 3D image carousel (case studies)
  pages/
    AboutPage.tsx       # Dark theme, scroll-driven parallax, principles
    WorkPage.tsx        # Portfolio list/grid view, 8 case studies
    ErasedFontCasePage.tsx # Sample case study template
```

## Routes

- `/` - HomePage (hero + morphing system + system diagram)
- `/about` - About page (dark theme, principles, scroll effects)
- `/work` - Work page (portfolio list/grid toggle)
- `/work/erased-font` - Sample case study

## Design System

Reference: `DESIGN.md`

- Colors: #000000 (ink), #FFFFFF (paper), #F5F5F5 (subtle)
- Font: Geist Sans + Geist Mono (variable WOFF2 in src/assets/fonts/, fallback: Helvetica Neue, Arial)
- Grid: 12-col desktop / 4-col mobile, 0px gutter, 24px mobile margin / 48px desktop margin
- Typography: clamp() for h1/h2, vw units for display text, fixed px for micro labels

## Responsive Breakpoints

Mobile-first with Tailwind prefixes:
- Base: 0-639px (mobile)
- `sm:` 640px+ (large phones)
- `md:` 768px+ (tablets)
- `lg:` 1024px+ (desktop)
- `xl:` 1280px+ (large desktop)

## Commands

```bash
npm run dev      # Vite dev server (port 3000, 0.0.0.0)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # TypeScript type check
npm run clean    # Remove dist/
```

## Conventions

- Tailwind v4 @theme in index.css (no separate tailwind.config)
- Mobile-first responsive classes
- clamp() for scaling typography
- No CSS modules or styled-components; all Tailwind utility classes
- Animation: Three.js for 3D, GSAP for carousels, Motion for transitions/scroll
- Images: local placeholders in `/public/placeholders/` (REPLACE with your own assets)
- Static data: hardcoded arrays in components (no API calls for content)

## Environment Variables

- `EXAMPLE_API_KEY` - your provider key (exposed via vite.config.ts define)

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSCOVALENT BANK**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
