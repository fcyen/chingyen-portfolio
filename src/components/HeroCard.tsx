import type { ReactElement } from "react";
import { ArrowSE, GithubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import type { Persona } from "@/lib/persona";
import { PERSONA_CONTENT } from "@/lib/personaContent";
import styles from "./HeroCard.module.css";

/*
 * HeroCard — name, persona-dependent summary, social links, and a small
 * meta strip with version + location. Persistent across personas; only the
 * `summary` paragraph swaps with the active persona.
 *
 * All href values are placeholders — the user will provide real URLs.
 */

type SocialDef = {
  label: string;
  href: string;
  Icon: () => ReactElement;
};

const SOCIALS: readonly SocialDef[] = [
  { label: "linkedin", href: "#", Icon: LinkedInIcon },
  { label: "github", href: "#", Icon: GithubIcon },
  { label: "email", href: "#", Icon: MailIcon },
];

export default function HeroCard({ persona }: { persona: Persona }) {
  const summary = PERSONA_CONTENT[persona].heroSummary;

  return (
    <div className={styles.root}>
      <div className={`mono uppr ${styles.eyebrow}`}>// hello there ____</div>

      <h1 className={`serif ${styles.title}`}>
        Hi, I&apos;m <em>Ching&nbsp;Yen</em>.
      </h1>

      <p className={styles.summary}>{summary}</p>

      <div className={styles.socials}>
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className={styles.socialLink}
          >
            <Icon />
          </a>
        ))}
        <span className={`mono ${styles.socialMeta}`}>
          {"<"}03{">"} channels
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={`mono ${styles.version}`}>
            <b>chingyen</b>
            <span className={styles.versionDim}>.portfolio</span>{" "}
            <span className={styles.versionDim}>///</span>{" "}
            <span className={styles.versionDim}>v0.4.2</span>
          </span>
          <span className={`ticker ${styles.statusOnline}`}>
            [ <b>online</b> ]
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={`ticker ${styles.based}`}>
            based: <b>SF · NYC</b>
          </span>
          <a href="#" className="arrow-link" style={{ fontSize: 10 }}>
            work with me <ArrowSE />
          </a>
        </div>
      </div>
    </div>
  );
}
