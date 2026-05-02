import { useEffect, type MouseEvent } from "react";
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

const DETAILS_ANCHOR_ID = "home-details";

/**
 * Home — character-select stage. Owns the layout shell, persona state +
 * deep-link via `?p=...`, keyboard nav (1/2/3 + ←/→ skipping locked),
 * body-level scroll lock (desktop only), and the AmbientBackground / Frame
 * chrome.
 *
 * On mobile (≤1100px) the layout collapses to a single scrolling column with
 * CharacterStage + WeaponSelector side-by-side, a "// scroll for details"
 * hint, the right card below, then the bottom widget. Body scroll is allowed
 * so the user can reach everything below the fold.
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

  // Body-level styles only on Home: lock scroll on desktop (where the layout
  // is sized to the viewport), expose persona for any body-scoped CSS, and
  // clean up on unmount. On mobile we let the body scroll naturally — see
  // .home-active rule in Home.module.css.
  useEffect(() => {
    document.body.classList.add("home-active");
    return () => {
      document.body.classList.remove("home-active");
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

  const onScrollHintClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(DETAILS_ANCHOR_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Crossfade the bottom widget on persona switch. Builder shows
  // SubstackWidget; the others show PersonaTagCard. Keying by slot
  // ("substack" vs "tag-<persona>") so swapping crafter↔explorer also
  // animates.
  const widget = (
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
  );

  return (
    <>
      <AmbientBackground persona={persona} />
      <Frame />
      <main className={styles.stage}>
        <section className={styles.center}>
          <div className={styles.characterWrap}>
            <CharacterStage persona={persona} />
          </div>
          <div className={styles.selector}>
            <WeaponSelector persona={persona} onPersonaChange={setPersona} />
          </div>
        </section>

        <div className={styles.hero}>
          <HeroCard persona={persona} />
        </div>

        {/* Mobile-only: scroll hint that jumps the user to RightCard. */}
        <a
          href={`#${DETAILS_ANCHOR_ID}`}
          className={styles.scrollHint}
          onClick={onScrollHintClick}
        >
          <span className="mono uppr">// scroll for details</span>
          <span className={styles.scrollHintArrow} aria-hidden="true">
            ▼
          </span>
        </a>

        <section className={styles.right} id={DETAILS_ANCHOR_ID}>
          <RightCard persona={persona} />
        </section>

        <div className={styles.widget}>{widget}</div>
      </main>
    </>
  );
}
