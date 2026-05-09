import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { LANDING_PERSONAS, type LandingPersona } from "./personas";
import styles from "./Landing.module.css";

/**
 * Landing — the "at a glance" entry screen.
 *
 * Two layouts: a desktop character-select with hover-tags, and a mobile
 * stacked layout where each row is tap-to-expand (first tap shows tags +
 * Enter button, second tap navigates). Cards link through to /select.
 */
export default function Landing() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLanding /> : <DesktopLanding />;
}

function useIsMobile() {
  const query = "(max-width: 768px)";
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return matches;
}

/* ──────────────────── Desktop ──────────────────── */
function DesktopLanding() {
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
            chingyen.portfolio <span className={styles.divider}>///</span> v{__APP_VERSION__}
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
          I'm <em>Ching Yen</em>
        </h1>
        <p className={styles.heroBlurb}>
          A software engineer who designs as much as she ships. I've spent the
          last few years at GoodNotes and Zendesk building thoughtful
          interfaces and automated solutions. When I'm not in front of a screen, you'll find me outdoors
          with my camera.
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

      <div className={styles.cards} onMouseLeave={() => setHov(null)}>
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
        style={{ aspectRatio: persona.aspect }}
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

/* ──────────────────── Mobile ──────────────────── */
function MobileLanding() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleTap = (p: LandingPersona) => {
    if (expanded === p.id) navigate(`/select?p=${p.id}`);
    else setExpanded(p.id);
  };

  return (
    <div className={`${styles.mRoot} ${styles.pixelGrid}`}>
      <span className={`${styles.cornerBracket} ${styles.tl}`} />
      <span className={`${styles.cornerBracket} ${styles.tr}`} />
      <span className={`${styles.cornerBracket} ${styles.bl}`} />
      <span className={`${styles.cornerBracket} ${styles.br}`} />

      <div className={styles.mTopBar}>
        <span className={styles.statusDot} />
        <span>
          chingyen.portfolio <span className={styles.divider}>///</span> v{__APP_VERSION__}
        </span>
      </div>

      <div className={styles.mHeroEyebrow}>
        // HELLO THERE
        <span className={styles.blink}>_</span>
      </div>
      <h1 className={styles.mHeroTitle}>
        I'm <em>Ching Yen.</em>
      </h1>
      <p className={styles.mHeroBlurb}>
        A software engineer who designs as much as she ships. I've spent the
        last few years at GoodNotes and Zendesk building thoughtful interfaces
        and data pipelines that turn raw data into actionable insights. When
        I'm not in front of a screen, you'll find me outdoors with my camera.
      </p>
      <p className={styles.mHeroHint}>
        Tap a character to peek — tap again to enter.
      </p>

      <div className={styles.mSectionLabel}>// CHOOSE A LENS</div>

      <div className={styles.mCards}>
        {LANDING_PERSONAS.map((p) => {
          const isExp = expanded === p.id;
          const accentVar = {
            "--accent": p.accent,
            "--accent-soft": p.accentSoft,
            "--accent-glow": p.accentGlow,
          } as CSSProperties;
          return (
            <div
              key={p.id}
              className={`${styles.mCard} ${isExp ? styles.mCardExpanded : ""}`}
              style={accentVar}
            >
              {isExp && (
                <>
                  <span className={`${styles.mCardBracket} ${styles.sbTl}`} />
                  <span className={`${styles.mCardBracket} ${styles.sbTr}`} />
                  <span className={`${styles.mCardBracket} ${styles.sbBl}`} />
                  <span className={`${styles.mCardBracket} ${styles.sbBr}`} />
                </>
              )}
              <button
                type="button"
                className={styles.mCardRow}
                onClick={() => handleTap(p)}
              >
                <div
                  className={`${styles.mCharWrap} ${
                    isExp ? styles.mCharWrapExp : ""
                  }`}
                >
                  <span className={styles.mCharGlow} />
                  <img
                    src={p.img}
                    className={styles.mCharImg}
                    style={{ aspectRatio: p.aspect }}
                    alt=""
                  />
                </div>
                <div className={styles.mCardText}>
                  <div className={styles.mCardMeta}>
                    <span className={styles.mCardNum}>{p.num}</span>
                    <span className={styles.mCardSection}>{p.section}</span>
                  </div>
                  <div className={styles.mCardName}>
                    {p.name} <em>{p.italic}</em>
                  </div>
                  <div className={styles.mCardLabel}>{p.sectionLabel}</div>
                  {!isExp && <p className={styles.mCardBlurb}>{p.blurb}</p>}
                  {isExp && (
                    <div className={styles.mTagWrap}>
                      {p.tags.map((t, i) => (
                        <span
                          key={t.label}
                          className={styles.mTagPill}
                          style={{ animationDelay: `${i * 0.04}s` }}
                        >
                          +{t.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
              {isExp && (
                <button
                  type="button"
                  className={styles.mEnterBtn}
                  onClick={() => navigate(`/select?p=${p.id}`)}
                >
                  Enter {p.name} {p.italic} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.mFooter}>
        <div className={styles.mFooterLabel}>// ELSEWHERE</div>
        <div className={styles.mFooterGrid}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={styles.mFooterLink}
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <div className={styles.mFooterBased}>based — singapore</div>
      </div>
    </div>
  );
}

const SOCIALS = [
  { label: "LinkedIn", sym: "in", href: "https://www.linkedin.com/in/foo-ching-yen/" },
  { label: "GitHub", sym: "⌥", href: "https://github.com/fcyen/" },
  { label: "Email", sym: "@", href: "mailto:chingyenfoo@gmail.com" },
];
