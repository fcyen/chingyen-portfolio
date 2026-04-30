import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GithubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import type { Persona } from "@/lib/persona";
import { PERSONA_CONTENT } from "@/lib/personaContent";
import styles from "./HeroCard.module.css";

/*
 * HeroCard — name, persona-dependent summary, social links, and a small
 * meta strip with version + location. Persistent across personas; only the
 * `summary` paragraph swaps with the active persona.
 *  
 */

type SocialDef = {
  label: string;
  href: string;
  Icon: () => ReactElement;
};

const SOCIALS: readonly SocialDef[] = [
  { label: "linkedin", href: "https://www.linkedin.com/in/foo-ching-yen/", Icon: LinkedInIcon },
  { label: "github", href: "https://github.com/fcyen/", Icon: GithubIcon },
  { label: "email", href: "mailto:chingyenfoo@gmail.com", Icon: MailIcon },
];

export default function HeroCard({ persona }: { persona: Persona }) {
  const summary = PERSONA_CONTENT[persona].heroSummary;

  return (
    <div className={styles.root}>
      <div className={`mono uppr ${styles.eyebrow}`}>// hello there ____</div>

      <h1 className={`serif ${styles.title}`}>
        Hi, I&apos;m <em>Ching&nbsp;Yen</em>.
      </h1>

      {/* Crossfade summary on persona change. `mode="wait"` lets the old line
          finish exiting before the new one fades in so the layout doesn't jump. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={persona}
          className={styles.summary}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
        >
          {summary}
        </motion.p>
      </AnimatePresence>

      <div className={styles.socials}>
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={label}
            className={styles.socialLink}
          >
            <Icon />
          </a>
        ))}
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={`mono ${styles.version}`}>
            <b>chingyen</b>
            <span className={styles.versionDim}>.portfolio</span>{" "}
            <span className={styles.versionDim}>///</span>{" "}
            <span className={styles.versionDim}>v0.0.1</span>
          </span>
          <span className={`ticker ${styles.based}`}>
            based: <b>Singapore</b>
          </span>
        </div>
      </div>
    </div>
  );
}
