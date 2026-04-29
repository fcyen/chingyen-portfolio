# Implementation Plan — Ching Yen Portfolio

A staged plan for building the portfolio site from the Claude Design handoff in `design-reference/`. Each stage is roughly one PR's worth of work and ends in a testable, demoable state.

---

## Goals

- Faithfully recreate the character-select stage from `design-reference/project/portfolio.html` as a React app.
- Add a router so case-study posts and future bespoke project pages can have their own layouts.
- Make it work on mobile (dedicated stacked layout, not just a reflow).
- Replace the Substack signup with a real feed of recent posts.
- Ship to Netlify on a custom or Netlify subdomain.

## Decisions (locked)

| Topic | Choice |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Plain CSS + CSS variables (no Tailwind) |
| Animation | framer-motion + raw canvas/CSS |
| Posts | MDX in repo (pending confirmation — see Open Questions) |
| Substack | Build-time RSS fetch → bundled JSON |
| Mobile | Dedicated stacked layout at ≤768px |
| Background | Full-bleed, three skins per persona, 24fps cap, crossfade on switch |
| Deploy | Netlify |
| Name | "Ching Yen" |
| Assets/links | Placeholders, user will swap in |

## Open questions

Get answers before starting the noted stage.

- [ ] **Posts source** (Stage 7): MDX in repo, or just a typed array of external links?
- [ ] **Substack URL** (Stage 6): provide so the fetcher targets the real feed; until then, a placeholder URL with mocked data.
- [ ] **Tablet (768–1100px)** (Stage 8): dedicated layout, or jump straight from desktop to mobile?
- [ ] **Persona deep linking** (Stage 3): want `?p=crafter` shareable URLs, or always default to builder on load?
- [ ] **Analytics** (Stage 9): Netlify Analytics, Plausible, or none?
- [ ] **Domain** (Stage 9): custom domain or Netlify subdomain?

---

## Stage 1 — Scaffold

Get the project skeleton running.

- [ ] `npm create vite@latest` → React + TypeScript template
- [ ] Install: `react-router-dom`, `framer-motion`, `@fontsource/{instrument-serif,jetbrains-mono,inter}`
- [ ] Set up `tsconfig.json` with strict mode and path alias `@/* → src/*`
- [ ] Create folder structure per CLAUDE.md
- [ ] Add `src/styles/reset.css` and `src/styles/tokens.css` (port `:root` variables from `design-reference/project/portfolio.html`)
- [ ] Add `public/_redirects` with `/*  /index.html  200`
- [ ] Add `netlify.toml` (build command, publish dir, Node version)
- [ ] Set up React Router shell in `src/App.tsx` with routes: `/`, `/work/:slug`, `*` (NotFound) — placeholder components
- [ ] Add `npm run typecheck`, `lint` scripts
- [ ] First commit + push to `claude/build-portfolio-website-OZnK7`

**Done when**: `npm run dev` shows a blank "Home" page at `/` and a 404 at any other route.

---

## Stage 2 — Desktop layout shell

Build the bones of the character-select screen with empty placeholders.

- [ ] `routes/Home/index.tsx` — owns frame, dotted bg, persona context (local), `useEffect` for `body { overflow: hidden }` + `data-persona`
- [ ] Port the 3-column CSS grid from `app.jsx` (areas: `hero / stage / right` and `left / selector / right`)
- [ ] `min-width: 1180`, `min-height: 720` guard
- [ ] Implement `<Frame />` (the inset 1px border with corner squares)
- [ ] Implement `<DottedStageBg />` (radial-gradient dot pattern)
- [ ] Five empty `<section>` placeholders with debug borders so each grid area is visible
- [ ] Wire the persona keyboard nav (`1/2/3`, `←/→`) — skip locked
- [ ] Set up persona type + helpers in `lib/persona.ts`

**Done when**: layout matches the prototype's grid at 1180×720 and persona changes via keyboard log to console.

---

## Stage 3 — Persistent components (HeroCard, WeaponSelector)

The pieces that don't change between personas (or change only their content).

- [ ] Port `<PixelGrid>` primitive into `components/PixelGrid.tsx` (from `icons.jsx`)
- [ ] Port pixel weapon icons: `LaptopIcon`, `StickyIcon`, `CameraIcon`
- [ ] Port utility glyphs: `ArrowSE`, `ArrowR`, `LinkIcon`s, `LockIcon`, `PixelHeart`
- [ ] `<HeroCard>` — name, persona-dependent summary, social links, version chip, barcode strip
- [ ] `<WeaponSelector>` — three tiles, corner brackets on active, locked overlay, keyboard hints
- [ ] Persona-dependent text content lives in a typed `lib/personaContent.ts` (don't sprinkle strings)
- [ ] Decide on URL deep-link (`?p=crafter`) — implement if confirmed

**Done when**: clicking a weapon tile or pressing 1/2/3 swaps the active state visibly; HeroCard summary text changes with persona.

---

## Stage 4 — Character stage + ambient background

The centerpiece. This is the visually heaviest stage.

- [ ] `<CharacterStage>` — positions character image, scanlines (non-builder), annotations
- [ ] `<BuilderCharacter>` — uses placeholder PNG at `public/assets/builder-character-placeholder.png` (real asset comes from user)
- [ ] `<CharacterPlaceholder>` for crafter/explorer — port the dashed-frame placeholder card
- [ ] `<Annotations>` — corner labels like `<01> ships fast` (per persona)
- [ ] Crossfade character on persona switch via framer-motion `AnimatePresence mode="wait"`
- [ ] **Ambient background** (`AmbientBackground.tsx`):
  - [ ] Sits at root of Home, full-bleed, behind `#app`, in front of nothing else
  - [ ] Builder skin: matrix canvas, **density halved**, 24fps cap (frame-skip in `requestAnimationFrame`)
  - [ ] Crafter skin: CSS-only drifting paper/noise texture (tiled SVG with `@keyframes translate`)
  - [ ] Explorer skin: CSS-only slow gradient hue rotation + grain overlay
  - [ ] Crossfade between skins: two layers stacked, opacity transition ~400ms on persona change
  - [ ] `prefers-reduced-motion` → static gradient per persona, no canvas, no keyframes
  - [ ] Pause canvas via `document.visibilitychange`
- [ ] Bump `--panel` opacity from `0.62` to `~0.78` so panels remain readable over animated bg
- [ ] Drop the `body[data-persona]` body-tint CSS (now handled by AmbientBackground)
- [ ] Floaty character animation (`@keyframes float`) — gate behind reduced-motion

**Done when**: each persona shows its own animated full-bleed bg behind the stage, panels remain readable, no jank on persona switch, reduced-motion users get static fallbacks.

---

## Stage 5 — Right card + bottom-left widget (static content)

All three persona variants of the side panels, with placeholder data.

- [ ] `<RightCard>` shell — sticker tab, header, scrollable body, footer
- [ ] `<BuilderBody>` — timeline with diamond markers
- [ ] `<CrafterBody>` — post list (no real linking yet — that's Stage 7)
- [ ] `<ExplorerBody>` — blurred 3×3 photo grid behind locked overlay
- [ ] Bottom-left for builder: `<SubstackWidget>` shell with mocked posts (real feed in Stage 6)
- [ ] Bottom-left for crafter/explorer: `<PersonaTagCard>` — stat block + quote
- [ ] Crossfade on persona switch via framer-motion

**Done when**: switching personas swaps the right card and bottom-left content with the design's crossfade.

---

## Stage 6 — Substack feed (replaces signup)

Build-time RSS → JSON → bundled.

- [ ] `scripts/fetch-substack.mjs` — fetch `<substack-url>/feed`, parse with `fast-xml-parser`, extract title/link/pubDate/description, write top 3 to `src/data/substack.json`
- [ ] Hook into `package.json`: `"prebuild": "node scripts/fetch-substack.mjs"`
- [ ] Type the JSON: `src/data/substack.d.ts`
- [ ] Rewrite `<SubstackWidget>` as a feed (3 recent posts: title, date, link out)
- [ ] Keep the dark card styling from the prototype's signup
- [ ] Fallback: if fetch fails, use cached JSON in repo (don't break the build)
- [ ] Set up Netlify build hook URL; document daily cron in CLAUDE.md (cron-job.org or GitHub Actions)

**Done when**: production build pulls the latest 3 posts from the Substack RSS and renders them in the bottom-left widget.

---

## Stage 7 — Case-study post pages

Crafter post list links into real pages.

- [ ] **Confirm with user**: MDX or external links?
- [ ] If MDX:
  - [ ] Install `@mdx-js/rollup`, configure Vite plugin
  - [ ] `posts/<slug>.mdx` with frontmatter (title, tag, readTime, date)
  - [ ] `src/lib/posts.ts` — load all MDX, expose typed list
  - [ ] `routes/Work/[slug].tsx` — generic post layout (own header, no character-select chrome)
  - [ ] Wire Crafter post list to use real `<Link to={`/work/${slug}`}>`
  - [ ] One sample post in repo so the route is testable
- [ ] If external links: `posts.ts` typed array → posts list opens in new tab. Skip the Work route.
- [ ] Update 404 page to be on-brand

**Done when**: clicking a post in the Crafter view navigates to a working post page (or external link).

---

## Stage 8 — Mobile layout

Dedicated stacked layout. Likely the most visual-design-heavy stage.

- [ ] Drop `body { overflow: hidden }` and `min-width` below 1100px
- [ ] Single-column flow on ≤768px:
  - [ ] HeroCard (full width, reduced padding)
  - [ ] CharacterStage (~70vh max, fixed aspect ratio)
  - [ ] WeaponSelector (sticky to bottom, three icons in a row, no keyboard hint)
  - [ ] RightCard content (timeline / posts / locked grid) below
  - [ ] Substack feed at the bottom
- [ ] Animated bg → static persona-tinted gradient on mobile (no canvas)
- [ ] Annotations (`ships fast`, etc.) → drop or move below character
- [ ] Frame border → reduce inset to 8px or remove on mobile
- [ ] Tablet (768–1100px) — answer Open Question first; either dedicated 2-col layout or jump straight to mobile
- [ ] Test on real device (iOS Safari + Android Chrome) — `vh` quirks, tap target sizes, sticky positioning
- [ ] Respect safe-area insets (iPhone notch)

**Done when**: site is usable and visually intentional on a 375px-wide viewport.

---

## Stage 9 — Polish + ship

- [ ] Accessibility pass:
  - [ ] All interactive elements have visible focus rings
  - [ ] `aria-pressed` on weapon tiles, `aria-disabled` on locked
  - [ ] Alt text on all images (character art especially)
  - [ ] Color contrast AA on all text against bg + animated bg worst-case
  - [ ] Keyboard-only walkthrough of full site
- [ ] Performance:
  - [ ] Lighthouse desktop score 90+ across the board
  - [ ] Lighthouse mobile score 85+ (animated bg adds cost on desktop, mobile is static)
  - [ ] Verify bundle size — no surprise large deps
- [ ] SEO basics: `<title>`, meta description, OG image, favicon (pixel-art if possible)
- [ ] Set up Netlify site, connect repo, configure env vars (Substack URL)
- [ ] Configure custom domain (if user provides) + HTTPS
- [ ] Add analytics (per Open Question answer)
- [ ] Write top-level `README.md` with setup, dev, deploy notes
- [ ] Final design diff against `design-reference/project/portfolio.html` — note any intentional deviations

**Done when**: site is live at the deploy URL, lighthouse passes, design-reference parity confirmed.

---

## Out of scope (future)

- Bespoke project pages under `/projects/<slug>` — architecture supports them, content/design TBD
- Real Explorer photo grid (currently locked / placeholder)
- CMS integration if writing volume increases
- i18n
- Light/dark mode toggle (the design is light-only)

---

## Notes for whoever picks this up

- Read `CLAUDE.md` first.
- Read `design-reference/README.md` and `design-reference/project/portfolio.html` in full before touching anything.
- The prototype source is the visual spec, not a code template — reimplement, don't transcribe.
- Don't push to `main`. Working branch is `claude/build-portfolio-website-OZnK7`.
