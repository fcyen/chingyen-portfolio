// All panel components: hero card (top-left, persistent),
// right card (changes per persona), bottom-left widget (persona-dependent).

// ---------------------------------------------------------------
// HERO (top-left, persistent across personas)
// ---------------------------------------------------------------
const HeroCard = ({ persona }) => {
  const summary = {
    builder: "engineer building AI tools that are useful, calm, and a little weird.",
    crafter: "designer who likes systems, sticky notes, and the slow craft of getting it right.",
    explorer: "photographer with a soft spot for golden hour and unfamiliar streets."
  }[persona];

  return (
    <div style={{
      width: 360,
      padding: "22px 24px 20px",
      position: "relative"
    }}>
      {/* corner ticker */}
      <div style={{
        marginBottom: 14
      }}>
        <span className="mono uppr" style={{ fontSize: 11, color: "var(--ink-soft)" }}>
          // hello there ____
        </span>
      </div>

      <h1 className="serif" style={{
        margin: 0,
        fontSize: 50, lineHeight: 1.05,
        fontWeight: 400
      }}>
        Hi, I'm <em style={{ fontStyle: "italic" }}>Ching&nbsp;Yen</em>.
      </h1>

      <p style={{
        margin: "20px 0 0",
        fontSize: 14.5, lineHeight: 1.55,
        color: "var(--ink)",
        textWrap: "pretty",
        maxWidth: "36ch"
      }}>
        {summary}
      </p>

      {/* social row */}
      <div style={{
        marginTop: 18, display: "flex", alignItems: "center", gap: 10
      }}>
        {[
        { Icon: LinkedInIcon, label: "linkedin", href: "#" },
        { Icon: GithubIcon, label: "github", href: "#" },
        { Icon: MailIcon, label: "email", href: "#" }].
        map(({ Icon, label, href }) =>
        <a key={label} href={href} aria-label={label}
        style={{
          width: 34, height: 34, display: "inline-flex",
          alignItems: "center", justifyContent: "center",
          border: "1px solid var(--ink)",
          background: "var(--bg-tint)",
          color: "var(--ink)", textDecoration: "none",
          transition: "all 200ms"
        }}
        onMouseEnter={(e) => {e.currentTarget.style.background = "var(--ink)";e.currentTarget.style.color = "var(--bg-tint)";}}
        onMouseLeave={(e) => {e.currentTarget.style.background = "var(--bg-tint)";e.currentTarget.style.color = "var(--ink)";}}>
          
            <Icon />
          </a>
        )}
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-soft)", marginLeft: 6 }}>
          {"<"}03{">"} channels
        </span>
      </div>

      {/* barcode + meta strip (was top bar) */}
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink)" }}>
            <b>chingyun</b><span style={{ color: "var(--ink-soft)" }}>.portfolio</span> <span style={{ color: "var(--ink-soft)" }}>///</span> <span style={{ color: "var(--ink-soft)" }}>v0.4.2</span>
          </span>
          <span className="ticker" style={{ fontSize: 10 }}>[ <b>online</b> ]</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          <span className="ticker" style={{ fontSize: 10 }}>based: <b>SF · NYC</b></span>
          <a href="#" className="arrow-link" style={{ fontSize: 10 }}>work with me <ArrowSE /></a>
        </div>
      </div>
    </div>);

};

// ---------------------------------------------------------------
// RIGHT CARD — per persona
// ---------------------------------------------------------------
const RightCard = ({ persona }) => {
  return (
    <div className="panel-solid" style={{
      width: 380,
      height: "100%",
      display: "flex", flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* sticker tab */}
      <div style={{
        position: "absolute", top: -1, right: 18,
        background: "var(--ink)", color: "var(--bg-tint)",
        padding: "4px 10px",
        fontFamily: "var(--mono)", fontSize: 10,
        letterSpacing: "0.1em"
      }}>
        {persona === "builder" ? "BUILD/01" : persona === "crafter" ? "CRAFT/02" : "ROAM/03"}
      </div>

      {/* header */}
      <div style={{ padding: "20px 22px 14px", borderBottom: "1px solid var(--line)" }}>
        <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
          {persona === "builder" ? "section // work" : persona === "crafter" ? "section // craft" : "section // film"}
        </div>
        <h2 className="serif" style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 400, lineHeight: 1.05 }}>
          {persona === "builder" && <>The <em>Builder</em></>}
          {persona === "crafter" && <>The <em>Crafter</em></>}
          {persona === "explorer" && <>The <em>Explorer</em></>}
        </h2>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}>
          {persona === "builder" && <>focus: <b style={{ color: "var(--ink)" }}>AI engineering</b> &nbsp;·&nbsp; tools, agents, infra</>}
          {persona === "crafter" && <>focus: <b style={{ color: "var(--ink)" }}>thoughtful design</b> &nbsp;·&nbsp; systems &amp; product</>}
          {persona === "explorer" && <>focus: <b style={{ color: "var(--ink)" }}>photography</b> &nbsp;·&nbsp; 35mm + digital</>}
        </div>
      </div>

      {/* body — scrollable */}
      <div className="scroll" style={{ flex: 1, padding: "16px 22px 22px" }}>
        {persona === "builder" && <BuilderBody />}
        {persona === "crafter" && <CrafterBody />}
        {persona === "explorer" && <ExplorerBody />}
      </div>

      {/* footer */}
      <div style={{
        borderTop: "1px solid var(--line)",
        padding: "10px 22px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-soft)"
      }}>
        <span>&lt;{persona}.lvl&gt;</span>
        <span>scroll ↓</span>
      </div>
    </div>);

};

// --- builder: timeline -------------------------------------------------
const TIMELINE = [
{ year: "2024 — now", role: "AI Engineer", org: "Stealth · agents", blurb: "Building developer tools for autonomous coding agents. Eval pipelines, harnesses, traces." },
{ year: "2022 — 2024", role: "Senior SWE", org: "Mid-stage startup", blurb: "Led the inference platform. Cut p99 latency 3.4×. Shipped a small LLM gateway used by ~40 services." },
{ year: "2020 — 2022", role: "Software Engineer", org: "Early-stage startup", blurb: "Full-stack. Built the first version of the customer-facing product end to end." },
{ year: "2018 — 2020", role: "Engineer (intern→FT)", org: "Big tech", blurb: "Distributed systems team. Wrote a lot of Go. Learned what a postmortem feels like at 3am." }];


const BuilderBody = () =>
<div>
    <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 10 }}>
      &lt;timeline len=4&gt;
    </div>
    <div style={{ position: "relative", paddingLeft: 18 }}>
      <div style={{ position: "absolute", left: 4, top: 6, bottom: 6, width: 1, background: "var(--line)" }} />
      {TIMELINE.map((t, i) =>
    <div key={i} style={{ position: "relative", paddingBottom: 18 }}>
          <div style={{
        position: "absolute", left: -18, top: 6,
        width: 9, height: 9, background: "var(--bg-tint)",
        border: "1px solid var(--ink)",
        transform: "rotate(45deg)"
      }} />
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: "0.04em" }}>
            {t.year}
          </div>
          <div className="serif" style={{ fontSize: 20, lineHeight: 1.1, marginTop: 2 }}>
            {t.role}
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink)", marginTop: 2 }}>
            @ {t.org}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--ink-soft)" }}>
            {t.blurb}
          </p>
        </div>
    )}
    </div>
  </div>;


// --- crafter: design posts ---------------------------------------------
const POSTS = [
{ num: "01", title: "Designing a calmer notification system", meta: "case study · 12 min", tag: "product" },
{ num: "02", title: "A type system for messy product data", meta: "case study · 8 min", tag: "systems" },
{ num: "03", title: "Onboarding without modals", meta: "essay · 4 min", tag: "patterns" },
{ num: "04", title: "What stickies actually do for a team", meta: "field notes · 6 min", tag: "process" },
{ num: "05", title: "Redesigning a financial dashboard", meta: "case study · 14 min", tag: "product" }];


const CrafterBody = () =>
<div>
    <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 8 }}>
      &lt;posts len=5&gt;
    </div>
    {POSTS.map((p) =>
  <a key={p.num} href="#" style={{
    display: "block",
    padding: "12px 0",
    borderBottom: "1px solid var(--line)",
    textDecoration: "none", color: "var(--ink)",
    position: "relative"
  }}
  onMouseEnter={(e) => {e.currentTarget.style.paddingLeft = "8px";}}
  onMouseLeave={(e) => {e.currentTarget.style.paddingLeft = "0";}}>
    
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{p.num}</span>
          <span className="mono uppr" style={{ fontSize: 9, color: "var(--ink-soft)" }}>
            [ {p.tag} ]
          </span>
        </div>
        <div className="serif" style={{ fontSize: 19, lineHeight: 1.15, marginTop: 4, transition: "all 200ms" }}>
          {p.title}
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 4 }}>
          {p.meta} <ArrowR />
        </div>
      </a>
  )}
    <a href="#" className="arrow-link" style={{ marginTop: 14 }}>
      all case studies <ArrowSE />
    </a>
  </div>;


// --- explorer: IG-style grid -------------------------------------------
const PHOTOS = [
{ caption: "lisbon, 06:42", palette: ["oklch(0.78 0.08 65)", "oklch(0.55 0.10 30)"] },
{ caption: "tokyo, midnight", palette: ["oklch(0.30 0.05 260)", "oklch(0.55 0.12 280)"] },
{ caption: "kyoto, fog", palette: ["oklch(0.85 0.02 140)", "oklch(0.55 0.04 160)"] },
{ caption: "porto, blue hour", palette: ["oklch(0.45 0.08 240)", "oklch(0.78 0.06 60)"] },
{ caption: "marrakech, noon", palette: ["oklch(0.78 0.10 50)", "oklch(0.50 0.13 35)"] },
{ caption: "iceland, road", palette: ["oklch(0.92 0.01 220)", "oklch(0.40 0.04 240)"] },
{ caption: "seoul, rain", palette: ["oklch(0.55 0.04 250)", "oklch(0.30 0.04 260)"] },
{ caption: "athens, marble", palette: ["oklch(0.90 0.01 80)", "oklch(0.65 0.04 70)"] },
{ caption: "oaxaca, market", palette: ["oklch(0.75 0.13 35)", "oklch(0.50 0.14 20)"] }];


const ExplorerBody = () =>
<div style={{ position: "relative", minHeight: 360 }}>
    {/* the actual content, dimmed */}
    <div style={{ filter: "blur(3px) grayscale(0.6)", opacity: 0.45, pointerEvents: "none", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
          @chingyun.raw
        </span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
          &lt;<b style={{ color: "var(--ink)" }}>247</b>&gt; frames
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {PHOTOS.map((p, i) =>
      <div key={i} style={{
        aspectRatio: "1",
        background: `linear-gradient(${i * 37 % 360}deg, ${p.palette[0]}, ${p.palette[1]})`
      }} />
      )}
      </div>
    </div>

    {/* lock overlay */}
    <div style={{
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 12, padding: 24, textAlign: "center",
    background: "repeating-linear-gradient(135deg, transparent 0 8px, oklch(0.18 0.012 60 / 0.04) 8px 9px), oklch(0.99 0.006 80 / 0.55)"
  }}>
      <div style={{
      width: 56, height: 56, display: "grid", placeItems: "center",
      background: "var(--ink)", color: "var(--bg-tint)"
    }}>
        <LockIcon size={26} />
      </div>
      <div className="mono uppr" style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: "0.18em" }}>
        // level&nbsp;03 &nbsp;·&nbsp; locked
      </div>
      <div className="serif" style={{ fontSize: 28, lineHeight: 1.05, fontStyle: "italic", maxWidth: "22ch" }}>
        The Explorer is still in development.
      </div>
      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-soft)", maxWidth: "30ch" }}>
        Photo grid coming soon. Pick another weapon to keep playing.
      </p>
      <div className="mono" style={{
      fontSize: 10, marginTop: 4, padding: "4px 10px",
      border: "1px solid var(--ink)", color: "var(--ink)",
      letterSpacing: "0.1em"
    }}>
        ◇ UNLOCK CONDITION: TBD
      </div>
    </div>
  </div>;


// ---------------------------------------------------------------
// BOTTOM-LEFT WIDGET (Substack for builder; null for others)
// ---------------------------------------------------------------
const SubstackWidget = () =>
<div style={{
  width: 320,
  background: "oklch(0.16 0.012 60)",
  color: "oklch(0.95 0.01 80)",
  padding: "16px 18px",
  boxShadow: "var(--shadow)",
  border: "1px solid var(--ink)",
  position: "relative", margin: "0px 0px 200px 20px"
}}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span className="mono uppr" style={{ fontSize: 10, color: "oklch(0.65 0.01 80)" }}>
        // substack &nbsp;·&nbsp; <span style={{ color: "var(--accent)" }}>weekly</span>
      </span>
      <PixelHeart scale={2} />
    </div>

    <div className="serif" style={{ fontSize: 22, lineHeight: 1.1, fontStyle: "italic" }}>
      Notes from a small lab.
    </div>
    <p style={{
    margin: "8px 0 0", fontSize: 12, lineHeight: 1.5,
    color: "oklch(0.78 0.01 80)"
  }}>
      A weekly-ish letter on agents, evals, and what i'm building this week.
      <br />~600 readers, no schedule discipline.
    </p>

    <form onSubmit={(e) => e.preventDefault()} style={{
    marginTop: 12, display: "flex", gap: 0,
    border: "1px solid oklch(0.95 0.01 80)"
  }}>
      <input
      type="email" placeholder="you@somewhere.com"
      style={{
        flex: 1, background: "transparent", border: 0, outline: "none",
        color: "oklch(0.95 0.01 80)", padding: "8px 10px",
        fontFamily: "var(--mono)", fontSize: 11
      }} />
    
      <button type="submit" style={{
      background: "oklch(0.95 0.01 80)", color: "oklch(0.16 0.012 60)",
      border: 0, padding: "8px 12px",
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
      cursor: "pointer", letterSpacing: "0.05em"
    }}>
        SUB →
      </button>
    </form>

    <div className="mono" style={{ fontSize: 9, color: "oklch(0.55 0.01 80)", marginTop: 8 }}>
      latest: <span style={{ color: "oklch(0.95 0.01 80)" }}>"why your eval suite lies to you"</span> &nbsp;·&nbsp; 4d ago
    </div>
  </div>;


Object.assign(window, { HeroCard, RightCard, SubstackWidget });