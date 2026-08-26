#!/usr/bin/env node
/**
 * Cache third-party embeds as local JSON + images so the article never
 * loads Twitter / YouTube / Instagram scripts (no consent needed).
 *
 *   node scripts/capture-embeds.mjs
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outJson = join(root, "src/data/embeds.json");
const pub = join(root, "public/images/embeds");

const TWEETS = [
  "1519797007904346115",
  "1607794241467723778",
  "1623636677158641665",
  "1610738950292766728",
  "1630996521738010634",
  "1631688805915787265",
  "1636012896713883650",
  "1638206419194314755",
  "1707081180238012491",
  "1709135625121624157",
  "1706692838539325789",
  "1706731529022378346",
  "1699485759038714134",
  "1702771997296468365",
  "1639031871148535808",
  "1633395809763860480",
];
const YOUTUBE = ["LsgIRqjvit0"];
const INSTAGRAM = ["C1cZlHJs7s0"];

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
      headers: { "user-agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const un = html.replaceAll('\\"', '"').replaceAll("\\/", "/");
    const display = [...un.matchAll(/"display_url":"(https:[^"]+)"/g)].map((m) => {
      let s = m[1];
      try {
        s = JSON.parse(`"${s}"`);
      } catch {
        s = s.replaceAll("\\/", "/").replaceAll("\\u0026", "&");
      }
      return s;
    });
    const unique = [];
    const seen = new Set();
    for (const url of display) {
      const key = url.split("?")[0];
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(url);
    }
    const images = [];
    for (const [i, url] of unique.entries()) {
      const dest = join(pub, "instagram", unique.length > 1 ? `${id}-${i}.jpg` : `${id}.jpg`);
      try {
        await download(url, dest, { referer: "https://www.instagram.com/" });
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
