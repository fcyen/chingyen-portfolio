/*
 * Persona-dependent text content for the Home (character-select) screen.
 * Centralised so copy changes don't sprawl across components.
 *
 * Strings are placeholders mirroring the prototype; the user will swap real
 * copy in later. URLs in HeroCard's social row are placeholders too.
 */
import type { Persona } from "@/lib/persona";

export type PersonaContent = {
  /** One-sentence summary used by HeroCard. */
  heroSummary: string;
};

export const PERSONA_CONTENT: Record<Persona, PersonaContent> = {
  builder: {
    heroSummary:
      "engineer building scalable frontends and bridging tech with business goals.",
  },
  crafter: {
    heroSummary:
      "designer who designs with tastefulness and crafts with intention.",
  },
  explorer: {
    heroSummary:
      "photographer who chases the golden hour in unfamiliar lands.",
  },
};

/** Two corner labels rendered around the CharacterStage per persona. */
export type Annotation = { code: string; text: string };

export const PERSONA_ANNOTATIONS: Record<Persona, readonly [Annotation, Annotation]> = {
  builder: [
    { code: "<01>", text: "ships fast" },
    { code: "<02>", text: "writes evals" },
  ],
  crafter: [
    { code: "<01>", text: "sweats details" },
    { code: "<02>", text: "sticky-note brain" },
  ],
  explorer: [
    { code: "<01>", text: "chases light" },
    { code: "<02>", text: "f/2 enthusiast" },
  ],
};

/* ---------------- RightCard content (Stage 5) ---------------- */

export type TimelineEntry = {
  year: string;
  role: string;
  org: string;
  blurb: string[];
};

/** Builder right-card timeline. Placeholder copy mirroring the prototype. */
export const BUILDER_TIMELINE: readonly TimelineEntry[] = [
  {
    year: "2025 — 2026",
    role: "Software Engineer",
    org: "GoodNotes",
    blurb: [
      "At GoodNotes, I worked closely with the CRM team to bring new customer engagement capabilities to their cross-platform app — features that weren't possible before, reaching millions of users worldwide.",
    ],
  },
  {
    year: "2021 — 2025",
    role: "Senior Software Engineer",
    org: "Zendesk",
    blurb: [
      "Zendesk is where I built my technical foundation. I worked on real-time Messaging features inside the Agent Workspace — a dense, high-throughput interface used by customer service agents to handle thousands of tickets a day. It taught me how to scale a web app without degrading performance, and how to move data efficiently between frontend and backend.",
      "I also learned how to ship at scale: controlled rollouts, observability instrumentation, and handling critical incidents under pressure. I built an internal tool that cut the diagnosis time for production issues from days to hours.",
    ],
  },
];

export type PostEntry = {
  num: string;
  title: string;
  meta: string;
  tag: string;
  /** Slug for /work/<slug> when present; otherwise the link is inert. */
  slug?: string;
};

/** Crafter right-card post list. */
export const CRAFTER_POSTS: readonly PostEntry[] = [
  {
    num: "01",
    title: "From Conversation to Working Prototype",
    meta: "case study · 9 min",
    tag: "product",
    slug: "kasih-link-phase-1",
  },
];

export type ExplorerPhoto = {
  caption: string;
  /**
   * Two sRGB hex colors used to fake a thumbnail with a linear-gradient.
   * Stored as hex (not oklch) so pre-2023 browsers can render the inline
   * `linear-gradient(...)` string — PostCSS only rewrites CSS files, not
   * JS string literals embedded into inline styles.
   */
  palette: readonly [string, string];
};

/** 3×3 grid of fake photo thumbs sitting behind the locked overlay. */
export const EXPLORER_PHOTOS: readonly ExplorerPhoto[] = [
  { caption: "lisbon, 06:42",     palette: ["#dbad81", "#a45a4e"] },
  { caption: "tokyo, midnight",   palette: ["#1f2e47", "#6568b6"] },
  { caption: "kyoto, fog",        palette: ["#c7d1c5", "#5e796a"] },
  { caption: "porto, blue hour",  palette: ["#255b7d", "#d5af91"] },
  { caption: "marrakech, noon",   palette: ["#eca57d", "#9f422b"] },
  { caption: "iceland, road",     palette: ["#dee6e9", "#344b5b"] },
  { caption: "seoul, rain",       palette: ["#607489", "#222e42"] },
  { caption: "athens, marble",    palette: ["#e1ddd7", "#9f8b75"] },
  { caption: "oaxaca, market",    palette: ["#f48e74", "#a43a41"] },
];

/* ---------------- Bottom-left widget content ---------------- */

export type RightCardMeta = {
  /** Tab sticker label, e.g. "BUILD/01". */
  sticker: string;
  /** Mono eyebrow above the heading, e.g. "section // work". */
  section: string;
  /** Persona heading rendered as `The <em>{label}</em>`. */
  heading: string;
  /** Mono focus line under the heading. */
  focus: { label: string; suffix: string };
};

export const RIGHT_CARD_META: Record<Persona, RightCardMeta> = {
  builder: {
    sticker: "BUILD/01",
    section: "section // work",
    heading: "Builder",
    focus: { label: "Fullstack engineering", suffix: "AI-powered prototypes, model integration, production observability" },
  },
  crafter: {
    sticker: "CRAFT/02",
    section: "section // design",
    heading: "Crafter",
    focus: { label: "UX & Product", suffix: "design thinking" },
  },
  explorer: {
    sticker: "ROAM/03",
    section: "section // photography",
    heading: "Explorer",
    focus: { label: "landscape / streets", suffix: "A7C + 24-70mm" },
  },
};
 
export type SubstackPostStub = {
  title: string;
  /** Human-friendly relative date for the mock; replaced by real RSS in Stage 6. */
  date: string;
};

/**
 * Mocked Substack posts for Stage 5. Stage 6 swaps these out for the real
 * RSS feed at build time (`scripts/fetch-substack.mjs` → `src/data/substack.json`).
 */
export const MOCK_SUBSTACK_POSTS: readonly SubstackPostStub[] = [
  // { title: "Why your eval suite lies to you", date: "4d ago" },
  // { title: "Notes on agent harnesses, week 3", date: "2w ago" },
  { title: "Building Products in the Age of AI", date: "recent" },
];

export type PersonaTag = {
  /** Stat block — three short rows. */
  stats: readonly { label: string; value: string }[];
  /** Italic pull quote underneath the stats. */
  quote: string;
  /** Mono attribution line. */
  attribution: string;
};

/**
 * Bottom-left widget for crafter/explorer (where the Substack feed isn't shown).
 * Lightweight stat block + quote that mirrors the design tone.
 */
export const PERSONA_TAGS: Record<Exclude<Persona, "builder">, PersonaTag> = {
  crafter: {
    stats: [
      { label: "method", value: "systems · sticky notes" },
      { label: "loves", value: "type, grids, restraint" },
      { label: "tools", value: "Figma · Linear · paper" },
    ],
    quote: "Designing is about choosing the right problems to solve",
    attribution: "// craft.tag",
  },
  explorer: {
    stats: [
      { label: "kit", value: "Sony A7C + 24/70mm" },
      { label: "hour", value: "sunrise" },
      { label: "edit", value: "Lightroom" },
    ],
    quote: "In the end we arrive where we started, and know the place for the first time.",
    attribution: "// roam.tag",
  },
};
