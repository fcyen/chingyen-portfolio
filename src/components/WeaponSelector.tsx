import type { ReactElement } from "react";
import { CameraIcon, LaptopIcon, LockIcon, StickyIcon } from "@/components/icons";
import { PERSONAS, type Persona, type PersonaDef } from "@/lib/persona";
import styles from "./WeaponSelector.module.css";

/*
 * WeaponSelector — three tiles (one per persona) with corner brackets on the
 * active tile, hatched lock overlay on locked personas, and keyboard hints
 * underneath. Mirrors the prototype's WeaponSelector.
 *
 * Mouse clicks on locked tiles are rejected. Keyboard nav lives on Home;
 * this component just reflects state.
 */

const ICONS: Record<Persona, (props: { scale?: number }) => ReactElement> = {
  builder: LaptopIcon,
  crafter: StickyIcon,
  explorer: CameraIcon,
};

type Props = {
  persona: Persona;
  onPersonaChange: (next: Persona) => void;
};

export default function WeaponSelector({ persona, onPersonaChange }: Props) {
  return (
    <div className={styles.root}>
      <span className={`mono uppr ${styles.label}`}>// choose your weapon</span>

      <div className={styles.tiles} role="group" aria-label="Choose persona">
        {PERSONAS.map((p, i) => (
          <Tile
            key={p.key}
            def={p}
            index={i}
            active={p.key === persona}
            onSelect={onPersonaChange}
          />
        ))}
      </div>

      <div className={styles.hints}>
        <span className="kbd">1</span>
        <span className="kbd">2</span>
        <span className="kbd">3</span>
        <span className={`mono ${styles.hintsLabel}`}>or</span>
        <span className="kbd">←</span>
        <span className="kbd">→</span>
        <span
          className={`mono ${styles.hintsLabel} ${styles["hintsLabel--switch"]}`}
        >
          to switch
        </span>
      </div>
    </div>
  );
}

function Tile({
  def,
  index,
  active,
  onSelect,
}: {
  def: PersonaDef;
  index: number;
  active: boolean;
  onSelect: (next: Persona) => void;
}) {
  const Icon = ICONS[def.key];
  const locked = !!def.locked;

  const classes = [styles.tile, active && styles.active, locked && styles.locked]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={() => {
        if (!locked) onSelect(def.key);
      }}
      aria-pressed={active}
      aria-disabled={locked}
      title={locked ? "level locked - stay tuned!" : def.label}
      className={classes}
    >
      {active && (
        <>
          <span className={`${styles.bracket} ${styles.bracketTL}`} />
          <span className={`${styles.bracket} ${styles.bracketTR}`} />
          <span className={`${styles.bracket} ${styles.bracketBL}`} />
          <span className={`${styles.bracket} ${styles.bracketBR}`} />
        </>
      )}

      {locked && (
        <>
          <div className={styles.lockHatch} />
          <div className={styles.lockBadge}>
            <LockIcon size={11} />
          </div>
        </>
      )}

      <div className={styles.icon}>
        <Icon scale={3} />
      </div>

      <div className={styles.tileFooter}>
        <span className={`mono ${styles.slot}`}>0{index + 1}</span>
        <span className={`mono uppr ${styles.weapon}`}>
          {locked ? "coming soon" : def.weapon}
        </span>
      </div>
    </button>
  );
}
