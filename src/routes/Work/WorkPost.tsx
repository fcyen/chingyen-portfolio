import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import KasihLinkPhase1 from "@/routes/projects/KasihLinkPhase1";
import NotFound from "@/routes/NotFound";

/*
 * /work/:slug — dispatches to the bespoke project component matching the slug.
 * Each case study is a self-contained page under `routes/projects/`, so they
 * can each define their own layout and visual language.
 */
const PROJECTS: Record<string, ComponentType> = {
  "kasih-link-phase-1": KasihLinkPhase1,
};

export default function WorkPost() {
  const { slug } = useParams<{ slug: string }>();
  const Project = slug ? PROJECTS[slug] : undefined;
  if (!Project) return <NotFound />;
  return <Project />;
}
