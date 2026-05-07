import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { LANDING_PERSONAS, type LandingPersona } from "./personas";
import styles from "./Landing.module.css";

/**
 * Landing — the "at a glance" entry screen. Centered hero with three
 * character cards. Hovering a card pops contextual tags around the
 * character; clicking enters the persona-specific screen at /select.
 *
 * Keyboard: 1/2/3 jump to a persona screen.
 *
 * The other screen designs are out of scope for this page; cards link
 * through to the existing character-select route at /select.
 */
export default function Landing() {
  const navigate = useNavigate();
  const [hov, setHov] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const idx = ["1", "2", "3"].indexOf(e.key);
      if (idx === -1) return;
      const p = LANDING_PERSONAS[idx];
      if (p) navigate(`/select?p=${p.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className={`${styles.root} ${styles.pixelGrid}`}>
      <span className={`${styles.cornerBracket} ${styles.tl}`} />
      <span className={`${styles.cornerBracket} ${styles.tr}`} />
      <span className={`${styles.cornerBracket} ${styles.bl}`} />
      <span className={`${styles.cornerBracket} ${styles.br}`} />

      <div className={styles.topBar}>
        <div className={styles.left}>
          <span className={styles.statusDot} />
          <span>
            chingyen.portfolio <span className={styles.divider}>///</span> v0.0.2
          </span>
        </div>
        <div className={styles.based}>
          based: <b>Singapore</b>
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroEyebrow}>
          // HELLO THERE
          <span className={styles.blink}>_</span>
        </div>
        <h1 className={styles.heroTitle}>
          Hi, I'm <em>Ching Yen.</em>
        </h1>
        <p className={styles.heroBlurb}>
          A Singapore-based engineer, designer, and photographer. I build
          thoughtful interfaces, prototype with AI, and chase light in
          unfamiliar places. Hover a character to peek at what they do — click
          to step into their world.
        </p>
        <div className={styles.socials}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className={styles.social}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.socialGlyph}>{s.sym}</span>
              {s.label}
            </a>
          ))}
        </div>
      </header>

      <div
        className={styles.cards}
        onMouseLeave={() => setHov(null)}
      >
        {LANDING_PERSONAS.map((p, i) => (
          <CharacterCard
            key={p.id}
            persona={p}
            isActive={hov === i}
            anyHovered={hov !== null}
            onHover={() => setHov(i)}
            onSelect={() => navigate(`/select?p=${p.id}`)}
          />
        ))}
      </div>

      <div className={styles.bottomHint}>
        <span>hover a character · click to enter</span>
        <span className={styles.bullet}>·</span>
        <span className={styles.kbdRow}>
          <kbd className={styles.kbd}>1</kbd>
          <kbd className={styles.kbd}>2</kbd>
          <kbd className={styles.kbd}>3</kbd>
        </span>
        <span>to jump</span>
      </div>
    </div>
  );
}

type CardProps = {
  persona: LandingPersona;
  isActive: boolean;
  anyHovered: boolean;
  onHover: () => void;
  onSelect: () => void;
};

function CharacterCard({
  persona,
  isActive,
  anyHovered,
  onHover,
  onSelect,
}: CardProps) {
  const dimmed = anyHovered && !isActive;
  // image height ~74% of card height; width via aspect
  const imgH = 540 * 0.74;
  const imgW = imgH * persona.aspect;

  const accentVar = { "--accent": persona.accent } as CSSProperties;

  return (
    <button
      type="button"
      className={`${styles.card} ${dimmed ? styles.dimmed : ""} ${
        isActive ? styles.active : ""
      }`}
      style={accentVar}
      onMouseEnter={onHover}
      onClick={onSelect}
      aria-label={`${persona.name} ${persona.italic} — ${persona.sectionLabel}`}
    >
      <div
        className={styles.platformGlow}
        style={{
          background: `radial-gradient(ellipse at center, ${persona.accentGlow} 0%, transparent 65%)`,
        }}
      />

      <img
        src={persona.img}
        className={styles.charImg}
        width={imgW}
        height={imgH}
        alt=""
      />

      <div className={styles.cardNum}>{persona.num}</div>
      <div className={styles.cardSection}>{persona.section}</div>

      <div className={styles.cardCaption}>
        <div className={styles.cardName}>
          {persona.name} <em>{persona.italic}</em>
        </div>
        <div className={styles.cardLabel}>{persona.sectionLabel}</div>
      </div>

      {isActive && (
        <>
          <span className={`${styles.selectBracket} ${styles.sbTl}`} />
          <span className={`${styles.selectBracket} ${styles.sbTr}`} />
          <span className={`${styles.selectBracket} ${styles.sbBl}`} />
          <span className={`${styles.selectBracket} ${styles.sbBr}`} />
          {persona.tags.map((tag, i) => {
            const isLeft = tag.side === "left";
            const pos: CSSProperties = isLeft
              ? { left: `${tag.x}%`, top: `${tag.y}%` }
              : { right: `${100 - tag.x}%`, top: `${tag.y}%` };
            return (
              <span
                key={tag.label}
                className={styles.tagPill}
                style={{
                  ...pos,
                  transform: "translateY(-50%)",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                {tag.label}
              </span>
            );
          })}
        </>
      )}
    </button>
  );
}

const SOCIALS = [
  { label: "LinkedIn", sym: "in", href: "#" },
  { label: "GitHub", sym: "⌥", href: "#" },
  { label: "Email", sym: "@", href: "#" },
  { label: "Substack", sym: "§", href: "#" },
];
