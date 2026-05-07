import type { Persona } from "@/lib/persona";

export type LandingTag = {
  label: string;
  x: number; // % of card width
  y: number; // % of card height
  side: "left" | "right";
};

export type LandingPersona = {
  id: Persona;
  num: string;
  name: string;
  italic: string;
  section: string;
  sectionLabel: string;
  accent: string;
  accentSoft: string;
  accentGlow: string;
  img: string;
  aspect: number;
  blurb: string;
  tags: LandingTag[];
};

export const LANDING_PERSONAS: readonly LandingPersona[] = [
  {
    id: "builder",
    num: "01",
    name: "The",
    italic: "Builder",
    section: "BUILD/01",
    sectionLabel: "WORK",
    accent: "#FF7A45",
    accentSoft: "rgba(255,122,69,0.14)",
    accentGlow: "rgba(255,122,69,0.28)",
    img: "/assets/character-builder.png",
    aspect: 550 / 1262,
    blurb:
      "engineer building scalable frontends and bridging tech with business goals.",
    tags: [
      { label: "Rapid AI prototyping", x: 4, y: 18, side: "left" },
      { label: "Frontend architecture", x: 96, y: 24, side: "right" },
      { label: "Design systems", x: 4, y: 42, side: "left" },
      { label: "TypeScript · React", x: 96, y: 48, side: "right" },
      { label: "iOS · Swift", x: 4, y: 66, side: "left" },
    ],
  },
  {
    id: "crafter",
    num: "02",
    name: "The",
    italic: "Crafter",
    section: "CRAFT/02",
    sectionLabel: "DESIGN",
    accent: "#E8B547",
    accentSoft: "rgba(232,181,71,0.14)",
    accentGlow: "rgba(232,181,71,0.32)",
    img: "/assets/character-crafter.png",
    aspect: 550 / 1280,
    blurb:
      "designer who designs with tastefulness and crafts with intention.",
    tags: [
      { label: "UX research", x: 4, y: 20, side: "left" },
      { label: "Design thinking", x: 96, y: 26, side: "right" },
      { label: "Interaction design", x: 4, y: 44, side: "left" },
      { label: "Figma · Code", x: 96, y: 50, side: "right" },
      { label: "Working prototypes", x: 4, y: 68, side: "left" },
    ],
  },
  {
    id: "explorer",
    num: "03",
    name: "The",
    italic: "Explorer",
    section: "ROAM/03",
    sectionLabel: "PHOTOGRAPHY",
    accent: "#7DD181",
    accentSoft: "rgba(125,209,129,0.14)",
    accentGlow: "rgba(125,209,129,0.30)",
    img: "/assets/character-explorer.png",
    aspect: 551 / 1231,
    blurb:
      "photographer who chases the golden hour in unfamiliar lands.",
    tags: [
      { label: "Landscape", x: 4, y: 22, side: "left" },
      { label: "Sony A7C", x: 96, y: 28, side: "right" },
      { label: "Golden hour", x: 4, y: 46, side: "left" },
      { label: "Travel photography", x: 96, y: 52, side: "right" },
      { label: "10+ countries", x: 4, y: 70, side: "left" },
    ],
  },
] as const;
