import { PixelLightning } from "@/components/icons";
import posts from "@/data/substack.json";
import type { SubstackPost } from "@/data/substack.d.ts";
import styles from "./SubstackWidget.module.css";

const SUBSTACK_URL = "https://fcyen.substack.com";

export default function SubstackWidget() {
  const feed = posts as SubstackPost[];

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={`mono uppr ${styles.label}`}>// learnings</span>
        <PixelLightning scale={2} />
      </div>

      <h3 className={styles.heading}>Substack</h3>
      <p className={styles.blurb}>
        Casual writings about what I have been reading about or working on - no set schedule
      </p>

      <div className={styles.posts}>
        {feed.length > 0 ? (
          feed.map((post) => (
            <a
              key={post.link + post.title}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.post}
            >
              <span className={styles.postTitle}>{post.title}</span>
              <span className={styles.postDate}>{post.pubDate}</span>
            </a>
          ))
        ) : (
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.post}
          >
            <span className={styles.postTitle}>Read on Substack →</span>
          </a>
        )}
      </div>

      <div className={styles.footer}>
        <span>fcyen.substack.com</span>
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readMore}
        >
          read more →
        </a>
      </div>
    </div>
  );
}
