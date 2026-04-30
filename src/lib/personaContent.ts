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
