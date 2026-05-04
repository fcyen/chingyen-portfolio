import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowR, CameraIcon, LaptopIcon, StickyIcon } from "@/components/icons";
import { PERSONAS, type Persona } from "@/lib/persona";
import styles from "./Entry.module.css";

const ICONS = {
  builder: LaptopIcon,
  crafter: StickyIcon,
  explorer: CameraIcon,
} satisfies Record<Persona, (props: { scale?: number }) => JSX.Element>;

const PATHS = [
  {
    key: "builder",
    meta: "BUILD/01",
    title: "Engineering",
    desc: "Frontend systems, AI prototypes, production craft.",
  },
  {
    key: "crafter",
    meta: "CRAFT/02",
    title: "Product Design",
    desc: "UX strategy, interface design, working prototypes.",
  },
  {
    key: "explorer",
    meta: "ROAM/03",
    title: "Photography",
    desc: "Landscape, street, and travel photography.",
  },
] as const;

export default function Entry() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePersona = PATHS[activeIndex].key;

  const unlockedPaths = useMemo(
    () => PATHS.filter((path) => !PERSONAS.find((p) => p.key === path.key)?.locked),
    [],
  );

  useEffect(() => {
    document.body.classList.add("entry-active");
    document.body.dataset.entryAccent = activePersona;

    return () => {
      document.body.classList.remove("entry-active");
      delete document.body.dataset.entryAccent;
    };
  }, [activePersona]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const numericIndex = Number(event.key) - 1;
      if (numericIndex >= 0 && numericIndex < PATHS.length) {
        setActiveIndex(numericIndex);
        document.getElementById(`entry-path-${PATHS[numericIndex].key}`)?.focus();
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        const direction =
          event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        setActiveIndex((current) => {
          const next = (current + direction + PATHS.length) % PATHS.length;
          document.getElementById(`entry-path-${PATHS[next].key}`)?.focus();
          return next;
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className={styles.shell} aria-labelledby="entry-title">
      <div className={`${styles.corner} ${styles.cornerTl}`} />
      <div className={`${styles.corner} ${styles.cornerTr}`} />
      <div className={`${styles.corner} ${styles.cornerBl}`} />
      <div className={`${styles.corner} ${styles.cornerBr}`} />

      <div className={`${styles.crosshair} ${styles.crosshairLeft}`} aria-hidden="true" />
      <div className={`${styles.crosshair} ${styles.crosshairRight}`} aria-hidden="true" />
      <div className={`${styles.crosshair} ${styles.crosshairBottom}`} aria-hidden="true" />

      <section className={styles.avatarStage} aria-label="Ching Yen avatar">
        <div className={styles.sideGlyphs} aria-hidden="true">
          <span>010101010101</span>
          <span>PORTFOLIO.ACCESS</span>
          <span>001101010011</span>
        </div>
        <div className={styles.avatarOrbit} aria-hidden="true">
          <LaptopIcon scale={4} />
          <StickyIcon scale={4} />
          <CameraIcon scale={4} />
        </div>
        <div className={styles.avatarWrap}>
          <img src="/assets/generic-avatar.png" alt="Pixel avatar of Ching Yen" />
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.intro}>
          <p className={styles.systemLabel}>// CHINGYEN.PORTFOLIO</p>
          <h1 id="entry-title" className="serif">
            Where should we begin?
          </h1>
          <p className={styles.lede}>
            Select the body of work most relevant to your visit.
            <span aria-hidden="true" />
          </p>
        </div>

        <nav className={styles.pathList} aria-label="Portfolio paths">
          {PATHS.map((path, index) => {
            const Icon = ICONS[path.key];
            const isActive = activeIndex === index;

            return (
              <Link
                key={path.key}
                id={`entry-path-${path.key}`}
                to={`/portfolio?p=${path.key}`}
                className={`${styles.pathItem} ${isActive ? styles.active : ""}`}
                data-accent={path.key}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <span className={styles.pathMeta}>{path.meta}</span>
                <span className={styles.pathIcon} aria-hidden="true">
                  <Icon scale={3} />
                </span>
                <span className={styles.pathTitle}>{path.title}</span>
                <span className={styles.pathDesc}>{path.desc}</span>
                <span className={styles.pathCta}>
                  Open <ArrowR size={13} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.keyHints} aria-label="Keyboard shortcuts">
          {unlockedPaths.map((path, index) => (
            <span
              key={path.key}
              className={activePersona === path.key ? styles.hintActive : ""}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
