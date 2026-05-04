import { useEffect, useRef } from "react";
import type { Persona } from "@/lib/persona";
import styles from "./AmbientBackground.module.css";

/*
 * AmbientBackground — full-bleed bg with one skin per persona, stacked and
 * crossfaded via opacity. Builder runs a 24fps matrix-rain canvas (density
 * halved relative to the prototype). Crafter and Explorer are CSS-only.
 *
 * The canvas pauses when the tab is hidden or when Builder isn't active, so
 * we don't burn cycles drawing pixels nobody can see. `prefers-reduced-motion`
 * is honoured at the CSS layer (canvas hidden, keyframes off).
 */

export default function AmbientBackground({ persona }: { persona: Persona }) {
  return (
    <div className={styles.root} aria-hidden="true">
      <div
        className={`${styles.skin} ${styles.builder} ${persona === "builder" ? styles.active : ""}`}
      >
        <BuilderMatrixCanvas active={persona === "builder"} />
        <div className={styles.builderGrid} />
        <div className={styles.builderVignette} />
      </div>

      <div
        className={`${styles.skin} ${styles.crafter} ${persona === "crafter" ? styles.active : ""}`}
      >
        <div className={styles.crafterNoise} />
      </div>

      <div
        className={`${styles.skin} ${styles.explorer} ${persona === "explorer" ? styles.active : ""}`}
      >
        <div className={styles.explorerGrass} />
        <div className={styles.explorerVignette} />
      </div>
    </div>
  );
}

/*
 * Matrix rain. Columns of monospace characters fall at varying speeds; each
 * frame paints a translucent dark wash over the canvas to leave a fading
 * trail. ~1 in 17 columns can flash a red accent glyph.
 *
 * Density halved → cell size 32px (prototype used 16px). Frame rate capped
 * at 24fps via timestamp throttle inside rAF. Paused when tab hidden or
 * when this skin isn't active.
 */
function BuilderMatrixCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window !== "undefined" && window.matchMedia) {
      // Reduced-motion users + mobile/tablet (≤1100px) get the static
      // persona gradient only; skip the rAF loop entirely.
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(max-width: 1100px)").matches
      ) {
        return;
      }
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 32;
    const FRAME_MS = 1000 / 24;
    const CHARS = "01<>{}[]/=*+-_$#@!?";
    const ACCENT_EVERY = 17;

    let w = 0;
    let h = 0;
    let cols = 0;
    const drops: number[] = [];
    const speeds: number[] = [];
    let raf = 0;
    let lastDraw = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCols = Math.ceil(w / CELL);
      while (drops.length < nextCols) {
        drops.push(Math.random() * -50);
        speeds.push(0.07 + Math.random() * 0.15);
      }
      cols = nextCols;
    };

    const drawFrame = () => {
      ctx.fillStyle = "rgba(8, 14, 28, 0.22)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "14px JetBrains Mono, ui-monospace, monospace";
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const x = i * CELL;
        const y = drops[i] * CELL;
        const ch = CHARS[(Math.random() * CHARS.length) | 0];

        if (i % ACCENT_EVERY === 0 && Math.random() < 0.02) {
          ctx.fillStyle = "rgba(255, 90, 90, 0.28)";
        } else {
          ctx.fillStyle = "rgba(140, 200, 255, 0.28)";
        }
        ctx.fillText(ch, x, y);

        ctx.fillStyle = "rgba(80, 130, 200, 0.09)";
        ctx.fillText(ch, x, y - CELL);

        drops[i] += speeds[i];
        if (drops[i] * CELL > h && Math.random() < 0.025) {
          drops[i] = Math.random() * -20;
        }
      }
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - lastDraw < FRAME_MS) return;
      lastDraw = t;
      drawFrame();
    };

    const start = () => {
      if (running) return;
      running = true;
      lastDraw = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (active) start();
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (active && !document.hidden) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={styles.matrixCanvas} />;
}
