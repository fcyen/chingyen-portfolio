// Character zone — uses real pixel-art for builder; placeholder for others.

const CharacterPlaceholder = ({ persona }) => {
  if (persona === "builder") return <BuilderCharacter />;

  const labels = {
    crafter:  ["girl + stickies","the crafter",  "designer.fig"],
    explorer: ["girl + camera",  "the explorer", "explorer.raw"],
  }[persona];

  const tints = {
    crafter:  "oklch(0.93 0.05 88)",
    explorer: "oklch(0.91 0.03 200)",
  };

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", bottom: "8%",
        width: "min(540px, 60%)", aspectRatio: "1 / 1",
        background: `radial-gradient(circle, ${tints[persona]} 0%, transparent 65%)`,
        filter: "blur(2px)",
      }} />
      <div className="floaty" style={{
        position: "relative", width: "min(420px, 46%)", aspectRatio: "3 / 4.4",
        marginBottom: "8%",
        border: "1px dashed var(--ink)",
        background: `repeating-linear-gradient(135deg, transparent 0 14px, oklch(0.18 0.012 60 / 0.04) 14px 15px)`,
        display: "flex", flexDirection: "column", padding: "16px",
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute", width: 6, height: 6, background: "var(--ink)",
            top: i < 2 ? -3 : "auto", bottom: i >= 2 ? -3 : "auto",
            left: i % 2 === 0 ? -3 : "auto", right: i % 2 === 1 ? -3 : "auto",
          }} />
        ))}
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-soft)",
        }}>
          <span>&lt;CHARACTER_SLOT/&gt;</span><span>P1</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PixelSilhouette persona={persona} />
        </div>
        <div style={{ borderTop: "1px solid var(--ink)", paddingTop: 10 }}>
          <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
            placeholder &nbsp;//&nbsp; drop pixel art here
          </div>
          <div className="serif" style={{ fontSize: 28, lineHeight: 1, marginTop: 4, fontStyle: "italic" }}>
            {labels[1]}
          </div>
          <div className="mono" style={{ fontSize: 10, marginTop: 4, color: "var(--ink-soft)" }}>
            asset: <b style={{color: "var(--ink)"}}>{labels[0]}.png</b> &nbsp;·&nbsp; 64×96px
          </div>
        </div>
      </div>
    </div>
  );
};

// Builder uses the real pixel-art image
const BuilderCharacter = () => (
  <div style={{
    position: "relative", width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    pointerEvents: "none",
  }}>
    {/* warm aura behind the character so she pops off the dark matrix */}
    <div style={{
      position: "absolute",
      width: "min(640px, 70%)", aspectRatio: "1 / 1",
      background: "radial-gradient(circle, oklch(0.85 0.05 75 / 0.55) 0%, oklch(0.85 0.05 75 / 0.18) 35%, transparent 65%)",
      filter: "blur(3px)",
    }} />
    <img
      src="assets/builder-character.png"
      alt="The Builder — pixel art"
      className="floaty"
      style={{
        position: "relative",
        height: "min(78%, 620px)",
        width: "auto",
        imageRendering: "pixelated",
        filter: "drop-shadow(0 22px 16px oklch(0 0 0 / 0.45))",
      }}
    />
  </div>
);

const PixelSilhouette = ({ persona }) => {
  const ROWS = {
    crafter: [
      "....#######.....", "...#kkkkkkk#....", "...#k#kkk#k#....",
      "...#kkkkkkk#....", "...#kkkkkkk#....", "....#kkkkk#.....",
      ".....##k##......", "....#######.....", "...####y####....",
      "..##l#yyy#l##...", ".###l#yyy#l###..", ".#kk#######kk#..",
      ".#kk#######kk#..", ".#############..", "..###########...",
      "..###########...", "...#########....", "....#######.....",
      "....##...##.....", "....##...##.....", "...###...###....",
      "..####...####...",
    ],
    explorer: [
      "....#######.....", "...#kkkkkkk#....", "...#k#kkk#k#....",
      "...#kkkkkkk#....", "...#k#####k#....", "....##ooo##.....",
      ".....##o##......", "....#######.....", "...####k####....",
      "..##l#####l##...", ".###l#####l###..", ".#kk#######kk#..",
      ".#kk#######kk#..", ".#############..", "..###########...",
      "..###########...", "...#########....", "....#######.....",
      "....##...##.....", "....##...##.....", "...###...###....",
      "..####...####...",
    ],
  };
  return <PixelGrid rows={ROWS[persona]} scale={6} color="var(--ink)" />;
};

// ---- Matrix background canvas (only for builder) ---------------------
const MatrixBackground = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const cell = 16;
    let cols = Math.ceil(w / cell);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const speeds = Array.from({ length: cols }, () => 0.25 + Math.random() * 0.5);
    const chars = "01<>{}[]/=*+-_$#@!?";
    const accentEvery = 17; // sparse red accents

    let t0 = performance.now();
    const draw = (t) => {
      const dt = (t - t0) / 16.6; t0 = t;
      cols = Math.ceil(w / cell);
      while (drops.length < cols) { drops.push(Math.random() * -50); speeds.push(0.25 + Math.random() * 0.5); }

      // fade the previous frame to create trails
      ctx.fillStyle = "rgba(8, 14, 28, 0.16)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "12px JetBrains Mono, monospace";
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const x = i * cell;
        const y = drops[i] * cell;
        const ch = chars[(Math.random() * chars.length) | 0];
        // head — bright
        if (i % accentEvery === 0 && Math.random() < 0.02) {
          ctx.fillStyle = "rgba(255, 90, 90, 0.85)";
        } else {
          ctx.fillStyle = "rgba(140, 200, 255, 0.85)";
        }
        ctx.fillText(ch, x, y);
        // tail trace
        ctx.fillStyle = "rgba(80, 130, 200, 0.35)";
        ctx.fillText(ch, x, y - cell);

        drops[i] += speeds[i] * dt;
        if (drops[i] * cell > h && Math.random() < 0.02) drops[i] = Math.random() * -20;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      background: "radial-gradient(ellipse at center, oklch(0.22 0.04 250) 0%, oklch(0.13 0.03 250) 60%, oklch(0.09 0.02 250) 100%)",
      borderRadius: 4,
    }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {/* perspective grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(to right, oklch(0.65 0.10 220 / 0.10) 1px, transparent 1px),
          linear-gradient(to bottom, oklch(0.65 0.10 220 / 0.10) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
      }} />
      {/* vignette so character zone reads */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, oklch(0.06 0.02 250 / 0.7) 95%)",
      }} />
      {/* center vacuum so the character has a clean stage */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: "55%", height: "70%", transform: "translate(-50%, -50%)",
        background: "radial-gradient(ellipse, oklch(0.13 0.03 250 / 0.85) 0%, transparent 70%)",
        filter: "blur(8px)",
      }} />
    </div>
  );
};

Object.assign(window, { CharacterPlaceholder, MatrixBackground });
