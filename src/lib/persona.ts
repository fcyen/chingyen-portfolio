/*
 * Persona type + helpers — used only on the Home (character-select) route.
 * Other routes don't have a persona.
 */

export type Persona = "builder" | "crafter" | "explorer";

export type PersonaDef = {
  key: Persona;
  label: string;
  weapon: string;
  locked?: boolean;
};

export const PERSONAS: readonly PersonaDef[] = [
  { key: "builder", label: "the builder", weapon: "laptop" },
  { key: "crafter", label: "the crafter", weapon: "stickies" },
  { key: "explorer", label: "the explorer", weapon: "camera", locked: true },
] as const;

export const DEFAULT_PERSONA: Persona = "builder";

export function isPersona(value: unknown): value is Persona {
  return value === "builder" || value === "crafter" || value === "explorer";
}

export function getPersona(key: Persona): PersonaDef {
  const p = PERSONAS.find((x) => x.key === key);
  if (!p) throw new Error(`Unknown persona: ${key}`);
  return p;
}

export function isLocked(key: Persona): boolean {
  return !!getPersona(key).locked;
}

/**
 * Step left/right through the persona list, skipping locked entries.
 * Returns the current persona unchanged if every other persona is locked.
 */
export function stepPersona(current: Persona, direction: 1 | -1): Persona {
  const i = PERSONAS.findIndex((p) => p.key === current);
  if (i === -1) return current;
  let next = i;
  for (let s = 0; s < PERSONAS.length; s++) {
    next = (next + direction + PERSONAS.length) % PERSONAS.length;
    if (!PERSONAS[next].locked) return PERSONAS[next].key;
  }
  return current;
}

/**
 * Pick a persona by number key ("1"|"2"|"3"). Returns null if the slot
 * is out of range or locked.
 */
export function personaFromNumberKey(key: string): Persona | null {
  const idx = Number(key) - 1;
  const p = PERSONAS[idx];
  if (!p || p.locked) return null;
  return p.key;
}

/**
 * Validate a `?p=` query param. Falls back to DEFAULT_PERSONA if missing,
 * unknown, or pointing at a locked persona.
 */
export function parsePersonaParam(value: string | null): Persona {
  if (!isPersona(value)) return DEFAULT_PERSONA;
  if (isLocked(value)) return DEFAULT_PERSONA;
  return value;
}
