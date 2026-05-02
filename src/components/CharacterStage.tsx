import { AnimatePresence, motion } from "framer-motion";
import type { Persona } from "@/lib/persona";
// import { PERSONA_ANNOTATIONS } from "@/lib/personaContent";
import styles from "./CharacterStage.module.css";

/*
 * CharacterStage — centre cell of the Home grid. Renders the persona's
 * character art with a soft spotlight, optional scanlines, and two corner
 * annotations. Crossfades the character on persona switch via framer-motion
 * AnimatePresence (mode="wait" keeps the stage from showing both at once).
 */

const CHARACTER_SRC: Record<Persona, string> = {
  builder: "/assets/character-builder.png",
  crafter: "/assets/character-crafter.png",
  explorer: "/assets/character-explorer.png",
};

const CHARACTER_ALT: Record<Persona, string> = {
  builder: "The Builder — pixel art",
  crafter: "The Crafter — pixel art",
  explorer: "The Explorer — pixel art",
};

export default function CharacterStage({ persona }: { persona: Persona }) {
  const isBuilder = persona === "builder";

  return (
    <div className={styles.root}>
      <div
        className={`${styles.spotlight} ${isBuilder ? styles.spotlightDark : styles.spotlightLight}`}
      />

      {/* TODO: Renable this when I have ideas */}
      {/* <Annotations persona={persona} /> */}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={persona}
          className={styles.character}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        >
          <img
            className={styles.floaty}
            src={CHARACTER_SRC[persona]}
            alt={CHARACTER_ALT[persona]}
          />
        </motion.div>
      </AnimatePresence>

      {!isBuilder && <div className={styles.scanlines} />}
    </div>
  );
}

// function Annotations({ persona }: { persona: Persona }) {
//   const notes = PERSONA_ANNOTATIONS[persona];
//   return (
//     <>
//       <div className={`${styles.annotation} ${styles.annotationTL}`}>
//         <div className={styles.annotationDot} />
//         <div>
//           <div className={styles.annotationCode}>{notes[0].code}</div>
//           <div className={styles.annotationText}>{notes[0].text}</div>
//         </div>
//       </div>
//       <div className={`${styles.annotation} ${styles.annotationBR}`}>
//         <div>
//           <div className={styles.annotationCode}>{notes[1].code}</div>
//           <div className={styles.annotationText}>{notes[1].text}</div>
//         </div>
//         <div className={styles.annotationDot} />
//       </div>
//     </>
//   );
// }
