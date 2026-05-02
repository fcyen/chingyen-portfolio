/**
 * fetch-substack.mjs
 *
 * Build-time script: fetches the Substack RSS feed, parses the top 3 items,
 * and writes them to src/data/substack.json.
 *
 * If the network fetch fails (e.g. CI with no outbound access, Substack down),
 * the script exits cleanly and leaves any existing substack.json untouched so
 * the build still succeeds with cached data.
 *
 * Usage: node scripts/fetch-substack.mjs
 * Hooked via package.json "prebuild".
 */

import { XMLParser } from "fast-xml-parser";
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FEED_URL = "https://fcyen.substack.com/feed";
const MAX_POSTS = 3;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/substack.json");

function formatDate(raw) {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw ?? "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchFeed() {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "chingyen-portfolio-build/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${FEED_URL}`);
  return res.text();
}

function parseItems(xml) {
  const parser = new XMLParser({ ignoreAttributes: false });
  const doc = parser.parse(xml);
  const items = doc?.rss?.channel?.item ?? [];
  const arr = Array.isArray(items) ? items : [items];
  return arr.slice(0, MAX_POSTS).map((item) => ({
    title: String(item.title ?? "").trim(),
    link: String(item.link ?? "").trim(),
    pubDate: formatDate(item.pubDate),
    description: String(item.description ?? "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 160)
      .trim(),
  }));
}

try {
  console.log(`[fetch-substack] Fetching ${FEED_URL} …`);
  const xml = await fetchFeed();
  const posts = parseItems(xml);
  writeFileSync(OUT_PATH, JSON.stringify(posts, null, 2) + "\n", "utf8");
  console.log(`[fetch-substack] Wrote ${posts.length} posts to ${OUT_PATH}`);
} catch (err) {
  console.warn(`[fetch-substack] Fetch failed: ${err.message}`);
  if (existsSync(OUT_PATH)) {
    console.warn("[fetch-substack] Using cached substack.json — build continues.");
  } else {
    console.warn("[fetch-substack] No cached file; build will use empty fallback.");
    writeFileSync(OUT_PATH, "[]\n", "utf8");
  }
}
