// Main app — composes the character-select stage.

const { useState, useEffect, useCallback } = React;

const PERSONAS = [
  { key: "builder",  label: "the builder",  weapon: "laptop",  Icon: LaptopIcon },
  { key: "crafter",  label: "the crafter",  weapon: "stickies", Icon: StickyIcon },
  { key: "explorer", label: "the explorer", weapon: "camera",  Icon: CameraIcon, locked: true },
];

const App = () => {
  const [persona, setPersona] = useState("builder");

  // sync persona to <body> for tint
  useEffect(() => {
    document.body.dataset.persona = persona;
  }, [persona]);

  // keyboard nav: 1/2/3 + ← → (skip locked personas)
  useEffect(() => {
    const onKey = (e) => {
      const pick = (key) => {
        const p = PERSONAS.find(x => x.key === key);
        if (p && !p.locked) setPersona(key);
      };
      if (e.key === "1") pick("builder");
      else if (e.key === "2") pick("crafter");
      else if (e.key === "3") pick("explorer");
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const i = PERSONAS.findIndex(p => p.key === persona);
        const d = e.key === "ArrowRight" ? 1 : -1;
        // step until we land on an unlocked persona
        let next = i;
        for (let s = 0; s < PERSONAS.length; s++) {
          next = (next + d + PERSONAS.length) % PERSONAS.length;
          if (!PERSONAS[next].locked) break;
        }
        setPersona(PERSONAS[next].key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persona]);

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      minHeight: 720,
      minWidth: 1180,
      padding: "26px 36px 28px",
      display: "grid",
      gridTemplateColumns: "minmax(340px, 380px) minmax(380px, 1fr) minmax(340px, 360px)",
      gridTemplateRows: "minmax(0, 1fr) auto",
      gridTemplateAreas: `
        "hero   stage  right"
        "left   selector right"
      `,
      columnGap: 22,
      rowGap: 14,
    }}>
      {/* HERO (top-left, persistent) */}
      <div style={{ gridArea: "hero", alignSelf: "start" }}>
        <HeroCard persona={persona} />
      </div>

      {/* CENTER STAGE — character zone */}
      <div style={{
        gridArea: "stage",
        position: "relative",
        minHeight: 0,
        minWidth: 0,
      }}>
        <CharacterStage persona={persona} />
      </div>

      {/* WEAPON SELECTOR */}
      <div style={{ gridArea: "selector", display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 0, minWidth: 0 }}>
        <WeaponSelector persona={persona} setPersona={setPersona} />
      </div>

      {/* BOTTOM LEFT widget */}
      <div style={{ gridArea: "left", alignSelf: "end" }}>
        {persona === "builder" && (
          <FadeKey k={persona}><SubstackWidget /></FadeKey>
        )}
        {persona !== "builder" && <PersonaTagCard persona={persona} />}
      </div>

      {/* RIGHT CARD — spans rows 2-3 */}
      <div style={{ gridArea: "right", height: "100%", minHeight: 0, display: "flex" }}>
        <FadeKey k={persona} style={{ flex: 1, display: "flex" }}>
          <RightCard persona={persona} />
        </FadeKey>
      </div>
    </div>
  );
};

// fade-on-key helper
const FadeKey = ({ k, children, style }) => {
  const [vis, setVis] = useState(true);
  const [shown, setShown] = useState(k);
  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => { setShown(k); setVis(true); }, 160);
    return () => clearTimeout(t);
  }, [k]);
  return (
    <div style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(6px)",
      transition: "opacity 240ms cubic-bezier(.4,0,.2,1), transform 240ms cubic-bezier(.4,0,.2,1)",
    }}>
      {React.cloneElement(children, { persona: shown })}
    </div>
  );
};

// ---------------------------------------------------------------
// TOP BAR
// ---------------------------------------------------------------
const TopBar = ({ persona }) => {
  const idx = PERSONAS.findIndex(p => p.key === persona);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", height: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink)" }}>
          <b>chingyun</b><span style={{color:"var(--ink-soft)"}}>.portfolio</span> /// <span style={{color:"var(--ink-soft)"}}>v0.4.2</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="ticker">[ <b>online</b> ]</span>
        <span className="ticker">based: <b>SF · NYC</b></span>
        <a href="#" className="arrow-link">work with me <ArrowSE /></a>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// CHARACTER STAGE
// ---------------------------------------------------------------
const CharacterStage = ({ persona }) => {
  const isBuilder = persona === "builder";
  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      overflow: "hidden",
      borderRadius: 4,
    }}>
      {/* matrix background only on builder */}
      {isBuilder && <MatrixBackground />}

      {/* center spotlight (light personas) */}
      {!isBuilder && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: "70%", height: "70%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, oklch(1 0 0 / 0.5) 0%, transparent 65%)",
          pointerEvents: "none",
        }}/>
      )}

      {/* annotation arrows pointing in */}
      <Annotations persona={persona} />

      <FadeKey k={persona} style={{ position: "absolute", inset: 0 }}>
        <CharacterPlaceholder />
      </FadeKey>

      {!isBuilder && <div className="scanlines"/>}
    </div>
  );
};

// little annotation labels around the character (editorial flourish)
const Annotations = ({ persona }) => {
  const notes = {
    builder:  [{ at: "tl", text: "ships fast", code: "<01>" }, { at: "br", text: "writes evals", code: "<02>" }],
    crafter:  [{ at: "tl", text: "sweats details", code: "<01>" }, { at: "br", text: "sticky-note brain", code: "<02>" }],
    explorer: [{ at: "tl", text: "chases light", code: "<01>" }, { at: "br", text: "f/2 enthusiast", code: "<02>" }],
  }[persona];

  const place = {
    tl: { top: "12%", left: "6%" },
    br: { bottom: "22%", right: "6%" },
  };

  return (
    <>
      {notes.map(n => (
        <div key={n.at} style={{
          position: "absolute", ...place[n.at],
          display: "flex", alignItems: "center", gap: 8,
          pointerEvents: "none",
          opacity: 0.92,
          color: persona === "builder" ? "oklch(0.92 0.02 220)" : "var(--ink)",
        }}>
          {n.at === "tl" && <Dot dark={persona === "builder"} />}
          <div>
            <div className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{n.code}</div>
            <div className="serif" style={{ fontSize: 16, fontStyle: "italic" }}>{n.text}</div>
          </div>
          {n.at === "br" && <Dot dark={persona === "builder"} />}
        </div>
      ))}
    </>
  );
};

const Dot = ({ dark }) => (
  <div style={{
    width: 8, height: 8,
    border: `1px solid ${dark ? "oklch(0.92 0.02 220)" : "var(--ink)"}`,
    background: dark ? "oklch(0.18 0.04 250)" : "var(--bg-tint)",
  }}/>
);

// ---------------------------------------------------------------
// WEAPON SELECTOR
// ---------------------------------------------------------------
const WeaponSelector = ({ persona, setPersona }) => {
  return (
    <div style={{
      padding: "12px 16px 10px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      minWidth: 460,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
          // choose your weapon
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        {PERSONAS.map((p, i) => {
          const active = persona === p.key;
          const locked = p.locked;
          return (
            <button key={p.key}
              onClick={() => { if (!locked) setPersona(p.key); }}
              aria-pressed={active}
              aria-disabled={locked}
              title={locked ? "locked — coming soon" : p.label}
              style={{
                position: "relative",
                width: 124, height: 92,
                padding: "10px 8px 8px",
                background: active ? "var(--bg-tint)" : "transparent",
                border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                cursor: locked ? "not-allowed" : "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
                transition: "all 200ms",
                outline: "none",
                opacity: locked ? 0.55 : 1,
              }}
              onMouseEnter={e => { if (!active && !locked) e.currentTarget.style.borderColor = "var(--ink)"; }}
              onMouseLeave={e => { if (!active && !locked) e.currentTarget.style.borderColor = "var(--line)"; }}
            >
              {/* corner brackets when active */}
              {active && <CornerBrackets />}

              {/* lock overlay */}
              {locked && (
                <>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "repeating-linear-gradient(135deg, transparent 0 6px, oklch(0.18 0.012 60 / 0.06) 6px 7px)",
                    pointerEvents: "none",
                  }}/>
                  <div style={{
                    position: "absolute", top: 6, right: 6,
                    width: 18, height: 18,
                    display: "grid", placeItems: "center",
                    background: "var(--ink)", color: "var(--bg-tint)",
                  }}>
                    <LockIcon size={11} />
                  </div>
                </>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <p.Icon scale={3} active={active} />
              </div>

              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-soft)" }}>0{i+1}</span>
                <span className="mono uppr" style={{
                  fontSize: 9,
                  color: active ? "var(--accent)" : "var(--ink-soft)",
                  fontWeight: active ? 700 : 400,
                }}>
                  {locked ? "locked" : p.weapon}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
        <span className="kbd">1</span>
        <span className="kbd">2</span>
        <span className="kbd">3</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>or</span>
        <span className="kbd">←</span>
        <span className="kbd">→</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-soft)", marginLeft: 6 }}>
          to switch
        </span>
      </div>
    </div>
  );
};

const CornerBrackets = () => {
  const c = { position: "absolute", width: 8, height: 8, borderColor: "var(--accent)", borderStyle: "solid" };
  return (
    <>
      <span style={{ ...c, top: -1, left: -1, borderWidth: "1px 0 0 1px" }}/>
      <span style={{ ...c, top: -1, right: -1, borderWidth: "1px 1px 0 0" }}/>
      <span style={{ ...c, bottom: -1, left: -1, borderWidth: "0 0 1px 1px" }}/>
      <span style={{ ...c, bottom: -1, right: -1, borderWidth: "0 1px 1px 0" }}/>
    </>
  );
};

// ---------------------------------------------------------------
// PERSONA TAG CARD (for crafter/explorer bottom-left — they don't have a widget yet)
// ---------------------------------------------------------------
const PersonaTagCard = ({ persona }) => {
  const data = {
    crafter:  { stat: "5+ yrs", note: "shipping product design", quote: "make it useful, then make it nice." },
    explorer: { stat: "37 cities", note: "rolls of film exposed",  quote: "the best camera is the one in the bag." },
  }[persona];
  if (!data) return null;
  return (
    <FadeKey k={persona}>
      <div className="panel" style={{ width: 320, padding: "16px 18px" }}>
        <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
          // stat block
        </div>
        <div className="serif" style={{ fontSize: 36, lineHeight: 1, marginTop: 4 }}>
          {data.stat}
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>
          {data.note}
        </div>
        <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }}/>
        <div className="serif" style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.4 }}>
          “{data.quote}”
        </div>
      </div>
    </FadeKey>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
