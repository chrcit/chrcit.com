#!/usr/bin/env node
/**
 * Cache third-party embeds as local JSON + images so the article never
 * loads Twitter / YouTube / Instagram scripts (no consent needed).
 *
 *   node scripts/capture-embeds.mjs
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outJson = join(root, "src/data/embeds.json");
const pub = join(root, "public/images/embeds");
const content = join(root, "src/content");

// Embed ids come from the content itself, so adding a post can't leave an
// embed uncaptured (it would silently render as a bare "View on …" link).
function contentSources() {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) files.push(path);
    }
  };
  walk(content);
  return files.map((f) => readFileSync(f, "utf8")).join("\n");
}

function collect(source, tag, normalise) {
  const ids = new Set();
  for (const m of source.matchAll(new RegExp(`<${tag}\\b[^>]*?(?:id|url)="([^"]+)"`, "g"))) {
    const id = normalise(m[1]);
    if (id) ids.add(id);
  }
  return [...ids];
}

const source = contentSources();
const TWEETS = collect(source, "Tweet", (v) => v.match(/(\d{10,})/)?.[1]);
const YOUTUBE = collect(
  source,
  "YouTube",
  (v) => v.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1] ?? v.match(/^[\w-]{6,}$/)?.[0],
);
const INSTAGRAM = collect(
  source,
  "Instagram",
  (v) => v.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/)?.[1] ?? v.match(/^[\w-]{5,}$/)?.[0],
);

console.log(`found ${TWEETS.length} tweets, ${YOUTUBE.length} youtube, ${INSTAGRAM.length} instagram`);

mkdirSync(join(pub, "avatars"), { recursive: true });
mkdirSync(join(pub, "media"), { recursive: true });
mkdirSync(join(pub, "youtube"), { recursive: true });
mkdirSync(join(pub, "instagram"), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "chrcit-embed-cache/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function download(url, dest, extraHeaders = {}) {
  if (existsSync(dest)) return dest;
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0", ...extraHeaders },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return dest;
}

function publicPath(abs) {
  return abs.replace(join(root, "public"), "");
}

function formatDate(raw) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const existing = existsSync(outJson) ? JSON.parse(readFileSync(outJson, "utf8")) : { tweets: {}, youtube: {}, instagram: {} };
const out = { tweets: { ...existing.tweets }, youtube: { ...existing.youtube }, instagram: { ...existing.instagram } };

for (const id of TWEETS) {
  try {
    const data = await getJson(`https://api.fxtwitter.com/status/${id}`);
    const t = data.tweet;
    const handle = t.author.screen_name;
    const avatarExt = (t.author.avatar_url || "").includes(".png") ? "png" : "jpg";
    const avatarAbs = join(pub, "avatars", `${handle}.${avatarExt}`);
    if (t.author.avatar_url) {
      try {
        await download(t.author.avatar_url.replace("_normal", "_200x200"), avatarAbs);
      } catch {
        await download(t.author.avatar_url, avatarAbs);
      }
    }
    const media = [];
    const photos = t.media?.photos || t.photos || [];
    for (const [i, p] of photos.entries()) {
      const url = p.url || p;
      const ext = String(url).includes(".png") ? "png" : "jpg";
      const dest = join(pub, "media", `${id}-${i}.${ext}`);
      try {
        await download(url, dest);
        media.push(publicPath(dest));
      } catch (e) {
        console.warn("photo fail", id, e.message);
      }
    }
    const videos = t.media?.videos || [];
    if (!media.length && videos[0]?.thumbnail_url) {
      const dest = join(pub, "media", `${id}-thumb.jpg`);
      try {
        await download(videos[0].thumbnail_url, dest);
        media.push(publicPath(dest));
      } catch (e) {
        console.warn("video thumb fail", id, e.message);
      }
    }
    const raw = t.raw_text;
    let text = typeof raw === "string" ? raw : raw?.text || t.text || "";
    if (typeof text !== "string") text = "";
    text = text.replace(/\s*https:\/\/t\.co\/\w+\s*$/g, "").trim();
    out.tweets[id] = {
      id,
      url: t.url || `https://x.com/i/status/${id}`,
      text,
      name: t.author.name,
      handle,
      date: formatDate(t.created_at),
      avatar: existsSync(avatarAbs) ? publicPath(avatarAbs) : null,
      media,
      video: videos.length > 0,
      likes: t.likes ?? 0,
      retweets: t.retweets ?? 0,
      replies: t.replies ?? 0,
      views: t.views ?? null,
    };
    console.log("tweet", id, "@" + handle, t.likes, "likes");
  } catch (e) {
    console.warn("tweet fail", id, e.message);
    out.tweets[id] ||= { id, url: `https://x.com/i/status/${id}`, text: "", name: "", handle: "", date: "", avatar: null, media: [], likes: 0, retweets: 0, replies: 0, views: null };
  }
  await sleep(250);
}

for (const id of YOUTUBE) {
  try {
    const meta = await getJson(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    const dest = join(pub, "youtube", `${id}.jpg`);
    try {
      await download(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`, dest);
    } catch {
      await download(meta.thumbnail_url, dest);
    }
    out.youtube[id] = {
      id,
      url: `https://www.youtube.com/watch?v=${id}`,
      title: meta.title,
      thumb: publicPath(dest),
    };
    console.log("youtube", id, meta.title);
  } catch (e) {
    console.warn("youtube fail", id, e.message);
  }
}

for (const id of INSTAGRAM) {
  try {
    const html = await fetch(`https://www.instagram.com/p/${id}/embed/captioned/`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "sec-fetch-dest": "iframe",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        referer: "https://chrcit.com/",
      },
    }).then((r) => r.text());
    const un = html
      .replaceAll("\\\\\\/", "/")
      .replaceAll("\\/", "/")
      .replaceAll("\\u0026", "&")
      .replaceAll("&amp;", "&");
    const unique = [];
    const seen = new Set();
    for (const match of un.matchAll(/(\d+_\d+_\d+_n\.jpg)\?stp=dst-jpg_e35_tt6/g)) {
      const fn = match[1];
      if (seen.has(fn)) continue;
      const chunk = un.slice(match.index, match.index + 1200);
      const full = chunk.match(/^([^"\s<>]+oe=[0-9A-Fa-f]{8})/);
      if (!full) continue;
      seen.add(fn);
      unique.push(`https://scontent-vie1-1.cdninstagram.com/v/t51.82787-15/${full[1]}`);
    }
    const images = [];
    for (const [i, url] of unique.entries()) {
      const dest = join(pub, "instagram", unique.length > 1 ? `${id}-${i}.jpg` : `${id}.jpg`);
      try {
        const res = await fetch(url, {
          headers: { "user-agent": "Mozilla/5.0", referer: "https://www.instagram.com/" },
        });
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        images.push(publicPath(dest));
      } catch (e) {
        console.warn("ig image fail", id, i, e.message);
      }
    }
    const username = un.match(/"username":"([^"]+)"/)?.[1] ?? "instagram";
    const likes = Number(un.match(/"edge_liked_by":\{"count":(\d+)\}/)?.[1] ?? 0);
    const captionRaw = un.match(/"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"(.*?)"\}\}\]/)?.[1];
    const caption = captionRaw
      ? captionRaw.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\u[\dA-Fa-f]{4}/g, (s) =>
          String.fromCharCode(parseInt(s.slice(2), 16)),
        )
      : "";
    if (!images.length) {
      const fallback = join(pub, "instagram", `${id}.jpg`);
      if (existsSync(fallback)) images.push(publicPath(fallback));
    }
    // Instagram blocks the embed endpoint often enough that a scrape returning
    // nothing must not clobber a good cached entry.
    if (!images.length && existing.instagram[id]) {
      console.warn("instagram", id, "nothing captured, keeping cached entry");
      continue;
    }
    out.instagram[id] = {
      id,
      url: `https://www.instagram.com/p/${id}/`,
      title: username,
      handle: username,
      caption,
      likes,
      images,
      image: images[0] ?? null,
    };
    console.log("instagram", id, images.length, "slides");
  } catch (e) {
    console.warn("instagram fail", id, e.message);
  }
}

writeFileSync(outJson, JSON.stringify(out, null, 2) + "\n");
console.log("wrote", outJson);
