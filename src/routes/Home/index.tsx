import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Frame from "@/components/Frame";
import AmbientBackground from "@/components/AmbientBackground";
import CharacterStage from "@/components/CharacterStage";
import HeroCard from "@/components/HeroCard";
import PersonaTagCard from "@/components/PersonaTagCard";
import RightCard from "@/components/RightCard";
import SubstackWidget from "@/components/SubstackWidget";
import WeaponSelector from "@/components/WeaponSelector";
import {
  parsePersonaParam,
  personaFromNumberKey,
  stepPersona,
  type Persona,
} from "@/lib/persona";
import styles from "./Home.module.css";

/**
 * Home — character-select stage. Owns the layout shell, persona state +
 * deep-link via `?p=...`, keyboard nav (1/2/3 + ←/→ skipping locked),
 * body-level scroll lock, and the AmbientBackground / Frame chrome.
 *
 * Cell components: HeroCard (top-left), CharacterStage (centre),
 * WeaponSelector (bottom-centre), Substack/PersonaTagCard (bottom-left),
 * RightCard (right column).
 */
export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const persona: Persona = parsePersonaParam(searchParams.get("p"));

  // Set persona via the URL — keeps the page shareable. `replace: true` so
  // persona switches don't pollute browser history. We always write the
  // active persona to `?p=` (including the default) so the URL is an honest
  // reflection of state.
  const setPersona = (next: Persona) => {
    if (next === persona && searchParams.get("p") === next) return;
    const params = new URLSearchParams(searchParams);
    params.set("p", next);
    setSearchParams(params, { replace: true });
  };

  // Seed `?p=` on first load when it's missing or invalid, so the URL
  // always reflects the active persona (including the default builder).
  useEffect(() => {
    if (searchParams.get("p") !== persona) {
      const params = new URLSearchParams(searchParams);
      params.set("p", persona);
      setSearchParams(params, { replace: true });
    }
    // Run once on mount; subsequent updates flow through setPersona.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Body-level styles only on Home: lock scroll, expose persona for any
  // body-scoped CSS, and clean up on unmount so other routes scroll normally.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    document.body.dataset.persona = persona;
    return () => {
      delete document.body.dataset.persona;
    };
  }, [persona]);

  // Keyboard nav — 1/2/3 jumps, ←/→ steps, both skip locked personas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in form fields.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "1" || e.key === "2" || e.key === "3") {
        const next = personaFromNumberKey(e.key);
        if (next) setPersona(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        setPersona(stepPersona(persona, dir));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // setPersona is recreated each render but only depends on searchParams;
    // we re-bind whenever persona changes so step math stays correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);

  return (
    <>
      <AmbientBackground persona={persona} />
      <Frame />
      <main className={styles.stage}>
        <section className={styles.hero}>
          <HeroCard persona={persona} />
        </section>

        <section className={styles.center}>
          <CharacterStage persona={persona} />
        </section>

        <section className={styles.selector}>
          <WeaponSelector persona={persona} onPersonaChange={setPersona} />
        </section>

        <section className={styles.left}>
          {/*
            Crossfade the bottom-left widget on persona switch. Builder shows
            SubstackWidget; the other personas show PersonaTagCard. We key by
            the rendered slot ("substack" vs "tag-<persona>") rather than by
            persona alone so swapping crafter↔explorer also gets a transition.
          */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={persona === "builder" ? "substack" : `tag-${persona}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            >
              {persona === "builder" ? (
                <SubstackWidget />
              ) : (
                <PersonaTagCard persona={persona} />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <section className={styles.right}>
          <RightCard persona={persona} />
        </section>
      </main>
    </>
  );
}
