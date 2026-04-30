import { PixelHeart } from "@/components/icons";
import { MOCK_SUBSTACK_POSTS } from "@/lib/personaContent";
import styles from "./SubstackWidget.module.css";

/*
 * SubstackWidget — bottom-left widget on Builder. Stage 5 ships the shell
 * with three mocked posts; Stage 6 wires it to the bundled RSS feed at
 * `src/data/substack.json` (built by `scripts/fetch-substack.mjs`).
 *
 * This is a *feed*, not a signup form — the prototype's email input was
 * dropped in the Stage 5 plan.
 */

export default function SubstackWidget() {
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={`mono uppr ${styles.label}`}>
          // substack &nbsp;·&nbsp;{" "}
          <span className={styles.labelAccent}>weekly</span>
        </span>
        <PixelHeart scale={2} />
      </div>

      <h3 className={styles.heading}>Notes from a small lab.</h3>
      <p className={styles.blurb}>
        A weekly-ish letter on agents, evals, and what i&apos;m building this
        week.
        <br />
        ~600 readers, no schedule discipline.
      </p>

      <div className={styles.posts}>
        {MOCK_SUBSTACK_POSTS.map((post) => (
          // Real `href` lands in Stage 6 from the parsed RSS item link.
          <a key={post.title} href="#" className={styles.post}>
            <span className={styles.postTitle}>{post.title}</span>
            <span className={styles.postDate}>{post.date}</span>
          </a>
        ))}
      </div>

      <div className={styles.footer}>
        <span>fcyen.substack.com</span>
        <a href="#" className={styles.readMore}>
          read more →
        </a>
      </div>
    </div>
  );
}
