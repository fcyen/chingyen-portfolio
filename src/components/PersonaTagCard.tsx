import { Fragment } from "react";
import { PERSONA_TAGS } from "@/lib/personaContent";
import type { Persona } from "@/lib/persona";
import styles from "./PersonaTagCard.module.css";

/*
 * PersonaTagCard — bottom-left widget for the crafter and explorer personas
 * (Builder gets SubstackWidget instead). A short stat block plus an italic
 * pull quote, stylistically a sibling of the prototype's "tag" notes.
 */

type Props = {
  persona: Exclude<Persona, "builder">;
};

export default function PersonaTagCard({ persona }: Props) {
  const tag = PERSONA_TAGS[persona];
  const sectionLabel = persona === "crafter" ? "craft" : "roam";

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={`mono uppr ${styles.label}`}>
          // tag &nbsp;·&nbsp;{" "}
          <span className={styles.labelAccent}>{sectionLabel}</span>
        </span>
        <span className={`mono ${styles.label}`}>
          {`<${persona}>`}
        </span>
      </div>

      <div className={styles.stats}>
        {tag.stats.map((stat) => (
          <Fragment key={stat.label}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </Fragment>
        ))}
      </div>

      <p className={styles.quote}>&ldquo;{tag.quote}&rdquo;</p>
      <div className={`mono ${styles.attribution}`}>{tag.attribution}</div>
    </div>
  );
}
