/**
 * fetch-instagram.mjs
 *
 * Build-time script: fetches the 12 most recent media items from the
 * Instagram Graph API and writes them to src/data/instagram.json.
 *
 * Requires the env var INSTAGRAM_TOKEN to be set to a valid long-lived
 * Instagram access token (obtained via Meta's app flow for the account
 * @jaedoncy). If the token is absent or the request fails, the script
 * exits cleanly and leaves any existing instagram.json untouched.
 *
 * Setup (one-time):
 *   1. Go to https://developers.facebook.com/ and create an app.
 *   2. Add the "Instagram" product and complete app review for
 *      instagram_basic + instagram_content_publish scopes.
 *   3. Generate a long-lived user access token (valid ~60 days).
 *   4. Set INSTAGRAM_TOKEN in Netlify → Site settings → Environment vars.
 *
 * Usage: node scripts/fetch-instagram.mjs
 * Hooked via package.json "prebuild".
 */

import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const TOKEN = process.env.INSTAGRAM_TOKEN;
const USERNAME = "jaedoncy";
const LIMIT = 12;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/instagram.json");

async function fetchPosts(token) {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set(
    "fields",
    "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp"
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", String(LIMIT));

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "chingyen-portfolio-build/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from Instagram API`);
  const json = await res.json();
  return (json.data ?? []).filter(
    (p) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM" || p.media_type === "VIDEO"
  );
}

if (!TOKEN) {
  console.warn("[fetch-instagram] INSTAGRAM_TOKEN not set — skipping fetch.");
  if (!existsSync(OUT_PATH)) {
    writeFileSync(
      OUT_PATH,
      JSON.stringify({ username: USERNAME, posts: [] }, null, 2) + "\n",
      "utf8"
    );
    console.warn("[fetch-instagram] Wrote empty instagram.json fallback.");
  }
  process.exit(0);
}

try {
  console.log("[fetch-instagram] Fetching Instagram media…");
  const posts = await fetchPosts(TOKEN);
  writeFileSync(
    OUT_PATH,
    JSON.stringify({ username: USERNAME, posts }, null, 2) + "\n",
    "utf8"
  );
  console.log(`[fetch-instagram] Wrote ${posts.length} posts to ${OUT_PATH}`);
} catch (err) {
  console.warn(`[fetch-instagram] Fetch failed: ${err.message}`);
  if (existsSync(OUT_PATH)) {
    console.warn("[fetch-instagram] Using cached instagram.json — build continues.");
  } else {
    console.warn("[fetch-instagram] No cached file; writing empty fallback.");
    writeFileSync(
      OUT_PATH,
      JSON.stringify({ username: USERNAME, posts: [] }, null, 2) + "\n",
      "utf8"
    );
  }
}
