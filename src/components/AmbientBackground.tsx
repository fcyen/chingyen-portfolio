import { useEffect, useRef } from "react";
import type { Persona } from "@/lib/persona";
import styles from "./AmbientBackground.module.css";

/*
 * AmbientBackground — full-bleed bg with one skin per persona, stacked and
 * crossfaded via opacity. Builder runs a 24fps matrix-rain canvas (density
 * halved relative to the prototype). Explorer runs a 24fps soft-grass canvas
 * (dark-green pencil-stroke clumps over a warm meadow paper). Crafter is
 * CSS-only.
 *
 * Both canvases pause when the tab is hidden or when their persona isn't
 * active, so we don't burn cycles drawing pixels nobody can see.
 * `prefers-reduced-motion` is honoured: the matrix canvas hides outright,
 * the grass canvas paints a single static frame and stops.
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
        <div className={styles.explorerClouds} />
        <ExplorerGrassCanvas active={persona === "explorer"} />
        <div className={styles.explorerSheen} />
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

/*
 * Soft-grass canvas. Seeds a handful of grass "clumps" on resize: each clump
 * is a cluster of 4–7 dark-green pencil strokes radiating up from a point.
 * The paper texture (fine speckles + ink hairs) is rendered once into an
 * offscreen canvas and composited each frame; only the clumps re-render
 * with a slow sway (frequency ~0.0006/ms, ±0.075rad). 24fps cap.
 *
 * Adapted from the soft-grass-background reference attached to issue #21.
 */
type GrassStroke = {
  offsetX: number;
  offsetY: number;
  angle: number;
  length: number;
  bend: number;
  alpha: number;
  width: number;
  phase: number;
};
type GrassClump = {
  x: number;
  y: number;
  rotation: number;
  strokes: GrassStroke[];
  phase: number;
  speed: number;
};
type Speckle = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  shade: [number, number, number];
};

function ExplorerGrassCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (typeof window !== "undefined" && window.matchMedia) {
      // Mobile/tablet: fall back to the static gradient meadow.
      if (window.matchMedia("(max-width: 1100px)").matches) return;
    }

    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const textureCanvas = document.createElement("canvas");
    const textureCtx = textureCanvas.getContext("2d", { alpha: true });
    if (!textureCtx) return;

    const FRAME_MS = 1000 / 24;

    let width = 0;
    let height = 0;
    const clumps: GrassClump[] = [];
    const speckles: Speckle[] = [];
    let raf = 0;
    let lastDraw = 0;
    let running = false;

    const seed = () => {
      clumps.length = 0;
      speckles.length = 0;

      const clumpCount = Math.max(9, Math.floor((width * height) / 112000));
      const minDistance = Math.max(112, Math.min(width, height) * 0.14);

      for (let i = 0; i < clumpCount; i += 1) {
        const scale = 0.76 + Math.random() * 1.22;
        const rotation = -0.18 + Math.random() * 0.36;
        const clusterLean = -0.32 + Math.random() * 0.64;
        const strokeCount = 4 + Math.floor(Math.random() * 4);
        const strokes: GrassStroke[] = [];
        let x = Math.random() * width;
        let y = Math.random() * height;

        for (let attempt = 0; attempt < 30; attempt += 1) {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const tooClose = clumps.some(
            (c) => Math.hypot(c.x - cx, c.y - cy) < minDistance
          );
          if (!tooClose) {
            x = cx;
            y = cy;
            break;
          }
        }

        for (let j = 0; j < strokeCount; j += 1) {
          const side = j - (strokeCount - 1) / 2;
          const spacing = 8 + Math.random() * 8;
          const sideLean = side * (0.045 + Math.random() * 0.035);
          const randomLean = -0.18 + Math.random() * 0.36;
          strokes.push({
            offsetX: side * spacing * scale + (-2.5 + Math.random() * 5) * scale,
            offsetY: (-2 + Math.random() * 4) * scale,
            angle: -Math.PI / 2 + clusterLean + sideLean + randomLean,
            length: (19 + Math.random() * 23) * scale,
            bend: -0.12 + Math.random() * 0.24,
            alpha: 0.28 + Math.random() * 0.2,
            width: (0.95 + Math.random() * 0.58) * scale,
            phase: Math.random() * Math.PI * 2,
          });
        }

        clumps.push({
          x,
          y,
          rotation,
          strokes,
          phase: Math.random() * Math.PI * 2,
          speed: 0.00055 + Math.random() * 0.0007,
        });
      }

      const speckleShades: [number, number, number][] = [
        [255, 255, 238],
        [248, 255, 226],
        [238, 250, 218],
        [255, 250, 226],
        [232, 246, 210],
      ];
      const speckleCount = Math.min(11000, Math.floor((width * height) / 145));
      for (let i = 0; i < speckleCount; i += 1) {
        speckles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.45 + Math.random() * 1.55,
          alpha: 0.07 + Math.random() * 0.15,
          shade: speckleShades[Math.floor(Math.random() * speckleShades.length)],
        });
      }
    };

    const drawPaperTexture = () => {
      textureCtx.clearRect(0, 0, width, height);
      textureCtx.globalCompositeOperation = "source-over";

      const fineShades = [
        "rgba(255, 255, 238, 0.05)",
        "rgba(246, 255, 225, 0.045)",
        "rgba(238, 250, 216, 0.04)",
      ];
      const fineCount = Math.min(19000, Math.floor((width * height) / 78));
      for (let i = 0; i < fineCount; i += 1) {
        textureCtx.fillStyle = fineShades[Math.floor(Math.random() * fineShades.length)];
        textureCtx.fillRect(
          Math.random() * width,
          Math.random() * height,
          1.2 + Math.random() * 2.1,
          1.2 + Math.random() * 2.1
        );
      }

      for (const dot of speckles) {
        textureCtx.fillStyle = `rgba(${dot.shade[0]}, ${dot.shade[1]}, ${dot.shade[2]}, ${dot.alpha})`;
        textureCtx.beginPath();
        textureCtx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        textureCtx.fill();
      }

      textureCtx.globalCompositeOperation = "screen";
      textureCtx.strokeStyle = "rgba(248, 255, 226, 0.055)";
      textureCtx.lineWidth = 1;
      for (let i = 0; i < 720; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const length = 5 + Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;
        textureCtx.beginPath();
        textureCtx.moveTo(x, y);
        textureCtx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        textureCtx.stroke();
      }

      textureCtx.strokeStyle = "rgba(255, 255, 238, 0.065)";
      for (let i = 0; i < 420; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const length = 3 + Math.random() * 12;
        const angle = Math.random() * Math.PI * 2;
        textureCtx.beginPath();
        textureCtx.moveTo(x, y);
        textureCtx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        textureCtx.stroke();
      }
    };

    const drawPencilStroke = (
      x: number,
      y: number,
      length: number,
      angle: number,
      bend: number,
      alpha: number,
      lineWidth: number
    ) => {
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      const cpX = x + Math.cos(angle + bend) * length * 0.48;
      const cpY = y + Math.sin(angle + bend) * length * 0.48;
      const baseWidth = Math.max(0.9, lineWidth * 0.68);

      const pointAt = (t: number) => {
        const inv = 1 - t;
        return {
          x: inv * inv * x + 2 * inv * t * cpX + t * t * endX,
          y: inv * inv * y + 2 * inv * t * cpY + t * t * endY,
        };
      };
      const normalAt = (t: number) => {
        const dx = 2 * (1 - t) * (cpX - x) + 2 * t * (endX - cpX);
        const dy = 2 * (1 - t) * (cpY - y) + 2 * t * (endY - cpY);
        const size = Math.hypot(dx, dy) || 1;
        return { x: -dy / size, y: dx / size };
      };

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let pass = 0; pass < 4; pass += 1) {
        const left: { x: number; y: number }[] = [];
        const right: { x: number; y: number }[] = [];
        const jitter = pass - 1.5;
        const passWidth = baseWidth * (0.88 + pass * 0.08);
        const passAlpha = alpha * (0.18 + pass * 0.12);

        for (let i = 0; i <= 8; i += 1) {
          const t = i / 8;
          const p = pointAt(t);
          const n = normalAt(t);
          const taper = Math.pow(1 - t, 1.45);
          const rough = 1 + Math.sin(t * 18 + length + pass) * 0.08;
          const halfWidth = Math.max(0.08, passWidth * taper * rough);
          const offsetX = jitter * 0.26 + Math.sin(length + pass + i) * 0.18;
          const offsetY = -jitter * 0.2 + Math.cos(angle * 7 + pass + i) * 0.16;
          left.push({
            x: p.x + n.x * halfWidth + offsetX,
            y: p.y + n.y * halfWidth + offsetY,
          });
          right.push({
            x: p.x - n.x * halfWidth + offsetX,
            y: p.y - n.y * halfWidth + offsetY,
          });
        }

        ctx.fillStyle = `rgba(36, 88, 34, ${passAlpha})`;
        ctx.beginPath();
        ctx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < left.length; i += 1) ctx.lineTo(left[i].x, left[i].y);
        for (let i = right.length - 1; i >= 0; i -= 1) ctx.lineTo(right[i].x, right[i].y);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(
          x + jitter * 0.18,
          y - jitter * 0.12,
          passWidth * 0.88,
          passWidth * 0.58,
          angle + Math.PI / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      for (let grain = 0; grain < 6; grain += 1) {
        const start = 0.05 + grain * 0.135;
        const end = Math.min(0.98, start + 0.28 + grain * 0.045);
        const sx = x + (endX - x) * start + Math.sin(grain + angle) * 1.1;
        const sy = y + (endY - y) * start + Math.cos(grain + bend) * 1.1;
        const ex = x + (endX - x) * end + Math.cos(grain + length) * 1.1;
        const ey = y + (endY - y) * end + Math.sin(grain + length) * 1.1;
        const gx = cpX + Math.sin(grain * 2 + angle) * 1.6;
        const gy = cpY + Math.cos(grain * 2 + bend) * 1.6;
        ctx.strokeStyle = `rgba(24, 68, 24, ${alpha * 0.23})`;
        ctx.lineWidth = Math.max(0.65, lineWidth * (0.5 - grain * 0.035));
        ctx.setLineDash([1.4, 2.1]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(gx, gy, ex, ey);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    };

    const drawClump = (clump: GrassClump, time: number) => {
      const sway = reducedMotion
        ? 0
        : Math.sin(time * clump.speed + clump.phase) * 0.075;
      for (const stroke of clump.strokes) {
        const animatedAngle =
          stroke.angle + sway * Math.sin(stroke.phase + time * 0.00025);
        const length =
          stroke.length +
          (reducedMotion ? 0 : Math.sin(time * 0.001 + stroke.phase) * 1.15);
        const x =
          clump.x +
          Math.cos(clump.rotation) * stroke.offsetX -
          Math.sin(clump.rotation) * stroke.offsetY;
        const y =
          clump.y +
          Math.sin(clump.rotation) * stroke.offsetX +
          Math.cos(clump.rotation) * stroke.offsetY;
        drawPencilStroke(
          x,
          y,
          length,
          animatedAngle,
          stroke.bend,
          stroke.alpha,
          stroke.width
        );
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(textureCanvas, 0, 0, width, height);

      ctx.globalCompositeOperation = "multiply";
      for (const clump of clumps) drawClump(clump, time);

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(255, 255, 220, 0.04)";
      ctx.fillRect(0, 0, width, height);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      textureCanvas.width = canvas.width;
      textureCanvas.height = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      textureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      drawPaperTexture();
      if (reducedMotion) draw(0);
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - lastDraw < FRAME_MS) return;
      lastDraw = t;
      draw(t);
    };

    const start = () => {
      if (running || reducedMotion) return;
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

    if (active && !document.hidden && !reducedMotion) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={styles.grassCanvas} />;
}
