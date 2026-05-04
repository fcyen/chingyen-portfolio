import { useEffect, useRef } from "react";
import type { Persona } from "@/lib/persona";
import styles from "./AmbientBackground.module.css";

/*
 * AmbientBackground — full-bleed bg with one skin per persona, stacked and
 * crossfaded via opacity. Builder runs a 24fps matrix-rain canvas (density
 * halved relative to the prototype). Explorer runs the nature rain/firefly
 * canvas from the reference background. Crafter is CSS-only.
 *
 * Each canvas pauses when the tab is hidden or when its skin isn't active, so
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
        <ExplorerNatureCanvas active={persona === "explorer"} />
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

type NatureStream = {
  x: number;
  y: number;
  speed: number;
  length: number;
  sway: number;
  phase: number;
  size: number;
  color: string;
};

type Firefly = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  color: string;
};

function ExplorerNatureCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window !== "undefined" && window.matchMedia) {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(max-width: 1100px)").matches
      ) {
        return;
      }
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const FRAME_MS = 1000 / 24;
    const BASE_FRAME_MS = 1000 / 60;
    const STREAM_SPACING = 64;
    const FIREFLY_AREA = 48000;
    const MAX_FIREFLIES = 60;
    const MIN_FIREFLIES = 24;
    const palette = ["#b9f28c", "#7ecf77", "#d7c96c", "#6bc1b2", "#dfe9bd"];
    const glyphs = ["|", "/", "\\", ":", "'", "`", ".", "*"];
    const streams: NatureStream[] = [];
    const fireflies: Firefly[] = [];

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastDraw = 0;
    let running = false;

    const rgba = (hex: string, alpha: number) => {
      const value = hex.replace("#", "");
      return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
    };

    const seed = () => {
      streams.length = 0;
      fireflies.length = 0;

      const columns = Math.ceil(width / STREAM_SPACING);
      for (let i = 0; i < columns; i += 1) {
        streams.push({
          x: i * STREAM_SPACING + Math.random() * (STREAM_SPACING * 0.5),
          y: Math.random() * height,
          speed: 0.28 + Math.random() * 0.92,
          length: 6 + Math.floor(Math.random() * 11),
          sway: Math.random() * 34,
          phase: Math.random() * Math.PI * 2,
          size: 11 + Math.random() * 7,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }

      const dots = Math.min(
        MAX_FIREFLIES,
        Math.max(MIN_FIREFLIES, Math.floor((width * height) / FIREFLY_AREA)),
      );
      for (let i = 0; i < dots; i += 1) {
        fireflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 1.8,
          vx: -0.05 + Math.random() * 0.1,
          vy: -0.03 + Math.random() * 0.06,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.45 ? "#dddf8f" : "#8ee6b5",
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawStream = (stream: NatureStream, time: number, step: number) => {
      const sway = Math.sin(time * 0.00045 + stream.phase) * stream.sway;
      ctx.font = `${stream.size}px "SFMono-Regular", Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < stream.length; i += 1) {
        const y = stream.y - i * stream.size * 1.25;
        if (y < -30 || y > height + 30) continue;

        const alpha = Math.max(0, 1 - i / stream.length);
        const x = stream.x + sway + Math.sin((y + time * 0.04) * 0.015) * 12;
        ctx.fillStyle = rgba(stream.color, alpha * 0.3);
        ctx.shadowBlur = 8 * alpha;
        ctx.shadowColor = stream.color;
        ctx.fillText(
          glyphs[(i + Math.floor(time * 0.004 + stream.x)) % glyphs.length],
          x,
          y,
        );
      }

      stream.y += stream.speed * step;
      if (stream.y - stream.length * stream.size > height + 60) {
        stream.y = -40;
        stream.x = Math.random() * width;
      }
    };

    const drawFirefly = (dot: Firefly, time: number, step: number) => {
      dot.x += (dot.vx + Math.sin(time * 0.0006 + dot.phase) * 0.035) * step;
      dot.y += (dot.vy + Math.cos(time * 0.0005 + dot.phase) * 0.03) * step;
      if (dot.x < -20) dot.x = width + 20;
      if (dot.x > width + 20) dot.x = -20;
      if (dot.y < -20) dot.y = height + 20;
      if (dot.y > height + 20) dot.y = -20;

      const pulse = 0.22 + Math.sin(time * 0.002 + dot.phase) * 0.17;
      const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.r * 6);
      gradient.addColorStop(0, rgba(dot.color, Math.max(0, pulse)));
      gradient.addColorStop(1, rgba(dot.color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r * 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (time - lastDraw < FRAME_MS) return;

      const delta = lastDraw > 0 ? time - lastDraw : FRAME_MS;
      const step = Math.min(delta / BASE_FRAME_MS, 4);
      lastDraw = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5, 29, 20, 0.045)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      streams.forEach((stream) => drawStream(stream, time, step));
      fireflies.forEach((dot) => drawFirefly(dot, time, step));
      ctx.shadowBlur = 0;
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

  return <canvas ref={canvasRef} className={styles.natureCanvas} />;
}
