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
      "designer who designs with restraints and crafts with intention.",
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
      "• Led the cross-platform integration of Braze within a complex TWA architecture, unlocking a net-new communication channel to reach cross-platform users for the first time — enabling targeted push notifications and marketing campaigns where no outreach capability previously existed.",
       "• Architected the end-to-end CRM data pipeline, designing event instrumentation and user attribute mapping to power advanced user segmentation — laying the foundation for the team's first data-driven lifecycle marketing efforts.",
       "• Engineered the cross-platform beta recruitment UI and implemented a feature-flagged rollout strategy within a condensed timeframe, surpassing recruitment targets by 300%."
    ]
  },
  {
    year: "2021 — 2025",
    role: "Senior Software Engineer",
    org: "Zendesk",
    blurb:[
      "• Built the Auto-Accept feature for the messaging product, reducing agents' first response time by streamlining ticket assignment. Drove adoption from 5% to 25% across targeted enterprise accounts through data-driven iteration on the user experience.",
      "• Co-led an internal project to build a diagnostic data pipeline, consolidating investigation data into a single location and shortening internal incident investigation time from days to hours.",
      "• Migrated high-traffic WebSocket endpoints to GraphQL, eliminating sticky sessions and tripling concurrent connection capacity to improve scalability of real-time messaging.",
      "• Built robust test suites for Tier 1 features and implemented monitoring and observability instrumentation on Datadog."
    ]
  }
];

export type PostEntry = {
  num: string;
  title: string;
  meta: string;
  tag: string;
  /** Slug for /work/<slug> when present; otherwise the link is inert. */
  slug?: string;
};

/** Crafter right-card post list. Real linking lands in Stage 7. */
export const CRAFTER_POSTS: readonly PostEntry[] = [
  { num: "01", title: "Designing a calmer notification system", meta: "case study · 12 min", tag: "product" },
  { num: "02", title: "A type system for messy product data", meta: "case study · 8 min", tag: "systems" },
  { num: "03", title: "Onboarding without modals", meta: "essay · 4 min", tag: "patterns" },
  { num: "04", title: "What stickies actually do for a team", meta: "field notes · 6 min", tag: "process" },
  { num: "05", title: "Redesigning a financial dashboard", meta: "case study · 14 min", tag: "product" },
];

export type ExplorerPhoto = {
  caption: string;
  /** Two oklch() colors used to fake a thumbnail with a linear-gradient. */
  palette: readonly [string, string];
};

/** 3×3 grid of fake photo thumbs sitting behind the locked overlay. */
export const EXPLORER_PHOTOS: readonly ExplorerPhoto[] = [
  { caption: "lisbon, 06:42",     palette: ["oklch(0.78 0.08 65)",  "oklch(0.55 0.10 30)"] },
  { caption: "tokyo, midnight",   palette: ["oklch(0.30 0.05 260)", "oklch(0.55 0.12 280)"] },
  { caption: "kyoto, fog",        palette: ["oklch(0.85 0.02 140)", "oklch(0.55 0.04 160)"] },
  { caption: "porto, blue hour",  palette: ["oklch(0.45 0.08 240)", "oklch(0.78 0.06 60)"] },
  { caption: "marrakech, noon",   palette: ["oklch(0.78 0.10 50)",  "oklch(0.50 0.13 35)"] },
  { caption: "iceland, road",     palette: ["oklch(0.92 0.01 220)", "oklch(0.40 0.04 240)"] },
  { caption: "seoul, rain",       palette: ["oklch(0.55 0.04 250)", "oklch(0.30 0.04 260)"] },
  { caption: "athens, marble",    palette: ["oklch(0.90 0.01 80)",  "oklch(0.65 0.04 70)"] },
  { caption: "oaxaca, market",    palette: ["oklch(0.75 0.13 35)",  "oklch(0.50 0.14 20)"] },
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
    focus: { label: "AI engineering", suffix: "tools, agents, infra" },
  },
  crafter: {
    sticker: "CRAFT/02",
    section: "section // craft",
    heading: "Crafter",
    focus: { label: "thoughtful design", suffix: "systems & product" },
  },
  explorer: {
    sticker: "ROAM/03",
    section: "section // film",
    heading: "Explorer",
    focus: { label: "photography", suffix: "35mm + digital" },
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
  { title: "Why your eval suite lies to you", date: "4d ago" },
  { title: "Notes on agent harnesses, week 3", date: "2w ago" },
  { title: "A small lab, a small letter", date: "1mo ago" },
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
    quote: "Design slowly, then ship the boring version first.",
    attribution: "// craft.tag",
  },
  explorer: {
    stats: [
      { label: "kit", value: "35mm + Fuji X" },
      { label: "habit", value: "golden hour" },
      { label: "frames", value: "247 in the queue" },
    ],
    quote: "Better to be lost outside than bored inside.",
    attribution: "// roam.tag",
  },
};
