import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowR } from "@/components/icons";
import type { Persona } from "@/lib/persona";
import {
  BUILDER_TIMELINE,
  CRAFTER_POSTS,
  EXPLORER_PHOTOS,
  RIGHT_CARD_META,
} from "@/lib/personaContent";
import instagramData from "@/data/instagram.json";
import styles from "./RightCard.module.css";

type IGPost = {
  id: string;
  media_type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
};

/*
 * RightCard — the right-column panel of the character-select stage.
 * Shell (sticker tab, header, scrollable body, mono footer) is persistent;
 * only the body and a few labels swap with the active persona, crossfading
 * via framer-motion AnimatePresence so the panel itself never re-mounts.
 *
 * Body subcomponents:
 *   - BuilderBody:  timeline with diamond markers
 *   - CrafterBody:  list of posts (links inert until Stage 7)
 *   - ExplorerBody: blurred 3×3 photo grid behind a locked overlay
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

function ExplorerBody() {
  const posts = (instagramData as { username: string; posts: IGPost[] }).posts;
  const username = instagramData.username;
  const hasPosts = posts.length > 0;

  return (
    <div>
      <div className={styles.igHead}>
        <span className={`mono ${styles.bodyEyebrow}`}>
          // @{username}
        </span>
        <a
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mono ${styles.igProfileLink}`}
        >
          view profile →
        </a>
      </div>

      <div className={styles.igGrid}>
        {hasPosts
          ? posts.map((post) => {
              const src =
                post.media_type === "VIDEO"
                  ? (post.thumbnail_url ?? post.media_url)
                  : post.media_url;
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.igPost}
                >
                  <img
                    src={src}
                    alt={post.caption ?? ""}
                    className={styles.igImg}
                    loading="lazy"
                  />
                  {post.caption && (
                    <div className={styles.igCaption}>
                      <span>{post.caption.slice(0, 80)}</span>
                    </div>
                  )}
                </a>
              );
            })
          : EXPLORER_PHOTOS.map((photo, i) => (
              <a
                key={photo.caption}
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.igPost} ${styles.igPostPlaceholder}`}
                style={{
                  background: `linear-gradient(${(i * 37) % 360}deg, ${photo.palette[0]}, ${photo.palette[1]})`,
                }}
              >
                <div className={styles.igCaption}>
                  <span>{photo.caption}</span>
                </div>
              </a>
            ))}
      </div>

      {!hasPosts && (
        <p className={`mono ${styles.igFeedNote}`}>
          // set INSTAGRAM_TOKEN in Netlify to load live feed
        </p>
      )}
    </div>
  );
}
