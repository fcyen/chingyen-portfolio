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
      "engineer building AI tools that are useful, calm, and a little weird.",
  },
  crafter: {
    heroSummary:
      "designer who likes systems, sticky notes, and the slow craft of getting it right.",
  },
  explorer: {
    heroSummary:
      "photographer with a soft spot for golden hour and unfamiliar streets.",
  },
};
