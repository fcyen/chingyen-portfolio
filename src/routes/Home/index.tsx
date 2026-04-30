import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Frame from "@/components/Frame";
import DottedStageBg from "@/components/DottedStageBg";
import {
  DEFAULT_PERSONA,
  parsePersonaParam,
  personaFromNumberKey,
  stepPersona,
  type Persona,
} from "@/lib/persona";
import styles from "./Home.module.css";

/**
 * Home — character-select stage.
 *
 * Stage 2 scope: layout bones, persona state, deep-link via `?p=...`,
 * keyboard nav (1/2/3 + ←/→), Frame + DottedStageBg, debug-bordered
 * placeholders for the five grid cells. Real cell content lands in
 * stages 3–5.
 */
export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const persona: Persona = parsePersonaParam(searchParams.get("p"));

  // Set persona via the URL — keeps the page shareable. `replace: true` so
  // persona switches don't pollute browser history.
  const setPersona = (next: Persona) => {
    if (next === persona) return;
    const params = new URLSearchParams(searchParams);
    if (next === DEFAULT_PERSONA) {
      params.delete("p");
    } else {
      params.set("p", next);
    }
    setSearchParams(params, { replace: true });
  };

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
        if (next) {
          // eslint-disable-next-line no-console
          console.log("[persona]", next);
          setPersona(next);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = stepPersona(persona, dir);
        // eslint-disable-next-line no-console
        console.log("[persona]", next);
        setPersona(next);
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
      <DottedStageBg />
      <Frame />
      <main className={styles.stage}>
        <section className={styles.hero}>
          <div className={styles.placeholder} data-label="hero">
            HeroCard
          </div>
        </section>

        <section className={styles.center}>
          <div className={styles.placeholder} data-label="stage">
            CharacterStage
          </div>
        </section>

        <section className={styles.selector}>
          <div className={styles.placeholder} data-label="selector">
            WeaponSelector
          </div>
        </section>

        <section className={styles.left}>
          <div className={styles.placeholder} data-label="left">
            Substack / PersonaTagCard
          </div>
        </section>

        <section className={styles.right}>
          <div className={styles.placeholder} data-label="right">
            RightCard
          </div>
        </section>
      </main>
    </>
  );
}
