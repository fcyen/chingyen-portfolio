import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowR } from "@/components/icons";
import type { Persona } from "@/lib/persona";
import {
  BUILDER_TIMELINE,
  CRAFTER_POSTS,
  RIGHT_CARD_META,
} from "@/lib/personaContent";
import instagramPosts from "@/data/instagram-posts.json";
import styles from "./RightCard.module.css";

/*
 * RightCard — the right-column panel of the character-select stage.
 * Shell (sticker tab, header, scrollable body, mono footer) is persistent;
 * only the body and a few labels swap with the active persona, crossfading
 * via framer-motion AnimatePresence so the panel itself never re-mounts.
 *
 * Body subcomponents:
 *   - BuilderBody:  timeline with diamond markers
 *   - CrafterBody:  list of posts (links inert until Stage 7)
 *   - ExplorerBody: curated Instagram post embeds via embed.js
 */

export default function RightCard({ persona }: { persona: Persona }) {
  const meta = RIGHT_CARD_META[persona];

  return (
    <div className={styles.root}>
      <div className={styles.sticker}>{meta.sticker}</div>

      <div className={styles.header}>
        <div className={`mono uppr ${styles.section}`}>{meta.section}</div>
        <h2 className={`serif ${styles.heading}`}>
          The <em>{meta.heading}</em>
        </h2>
        <div className={`mono ${styles.focus}`}>
          focus: <b>{meta.focus.label}</b> &nbsp;·&nbsp; {meta.focus.suffix}
        </div>
      </div>

      <div className={styles.body}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={persona}
            className={styles.bodyFade}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            {persona === "builder" && <BuilderBody />}
            {persona === "crafter" && <CrafterBody />}
            {persona === "explorer" && <ExplorerBody />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <span>&lt;{persona}.lvl&gt;</span>
        <span>scroll ↓</span>
      </div>
    </div>
  );
}

function BuilderBody() {
  return (
    <div>
      <div className={`mono uppr ${styles.bodyEyebrow}`}>
        &lt;timeline len={BUILDER_TIMELINE.length}&gt;
      </div>
      <div className={styles.timeline}>
        <div className={styles.timelineRail} />
        {BUILDER_TIMELINE.map((t) => (
          <div key={t.year} className={styles.timelineEntry}>
            <div className={styles.timelineDiamond} />
            <div className={`mono ${styles.timelineYear}`}>{t.year}</div>
            <div className={styles.timelineRole}>{t.role}</div>
            <div className={`mono ${styles.timelineOrg}`}>@ {t.org}</div>
            {t.blurb && t.blurb.map((line, i) => (
              <p key={i} className={styles.timelineBlurb}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CrafterBody() {
  return (
    <div>
      <div className={`mono uppr ${styles.bodyEyebrow}`}>
        &lt;posts len={CRAFTER_POSTS.length}&gt;
      </div>
      <div className={styles.postList}>
        {CRAFTER_POSTS.map((p) => {
          const inner = (
            <>
              <div className={styles.postHead}>
                <span className={`mono ${styles.postNum}`}>{p.num}</span>
                <span className={`mono uppr ${styles.postTag}`}>[ {p.tag} ]</span>
              </div>
              <div className={styles.postTitle}>{p.title}</div>
              <div className={`mono ${styles.postMeta}`}>
                {p.meta} <ArrowR />
              </div>
            </>
          );
          return p.slug ? (
            <Link key={p.num} to={`/work/${p.slug}`} className={styles.postRow}>
              {inner}
            </Link>
          ) : (
            <a key={p.num} href="#" className={styles.postRow}>
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}

type InstagramWindow = Window & { instgrm?: { Embeds: { process: () => void } } };

function ExplorerBody() {
  const { username, posts } = instagramPosts;

  useEffect(() => {
    const w = window as InstagramWindow;
    if (w.instgrm) {
      w.instgrm.Embeds.process();
      return;
    }
    if (!document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div>
      <div className={styles.igHead}>
        <span className={`mono ${styles.bodyEyebrow}`}>// @{username}</span>
        <a
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mono ${styles.igProfileLink}`}
        >
          view profile →
        </a>
      </div>

      <div className={styles.igEmbedList}>
        {posts.map((url) => (
          <blockquote
            key={url}
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={url}
            data-instgrm-version="14"
          />
        ))}
      </div>
    </div>
  );
}
