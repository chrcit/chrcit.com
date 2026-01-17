import { readFile, writeFile } from "node:fs/promises";

const seedPath = new URL("../data/games.seed.json", import.meta.url);
const outputPath = new URL("../app/data/games.json", import.meta.url);

const apiKey = process.env.RAWG_API_KEY;
if (!apiKey) {
  console.error("Missing RAWG_API_KEY in the environment.");
  process.exit(1);
}

const seedRaw = await readFile(seedPath, "utf8");
const seed = JSON.parse(seedRaw);
const games = Array.isArray(seed.games) ? seed.games : [];
const profileUrl = typeof seed.profileUrl === "string" ? seed.profileUrl : null;
const profileSections =
  Array.isArray(seed.profileSections) && seed.profileSections.length
    ? seed.profileSections
    : ["owned", "toplay"];

function extractClientParams(html) {
  const marker = "window.CLIENT_PARAMS";
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const eq = html.indexOf("=", start);
  const firstBrace = html.indexOf("{", eq);
  if (firstBrace === -1) return null;

  let depth = 0;
  for (let i = firstBrace; i < html.length; i += 1) {
    const char = html[i];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        const jsonText = html.slice(firstBrace, i + 1);
        return JSON.parse(jsonText);
      }
    }
  }

  return null;
}

async function fetchProfileSlugs(url, sections) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(`RAWG profile fetch failed: ${response.status}`);
  }

  const html = await response.text();
  const clientParams = extractClientParams(html);
  const profileGames = clientParams?.initialState?.profile?.games;
  if (!profileGames) return [];

  const slugs = new Set();
  for (const section of sections) {
    const list = profileGames[section]?.results;
    if (!Array.isArray(list)) continue;
    for (const game of list) {
      if (game?.slug) slugs.add(game.slug);
    }
  }

  return Array.from(slugs);
}

const manualEntries = games
  .map((entry) => ({
    slug: entry.rawgSlug ?? entry.slug ?? entry.id,
    featured: Boolean(entry.featured),
  }))
  .filter((entry) => entry.slug);

const entriesBySlug = new Map(
  manualEntries.map((entry) => [entry.slug, entry]),
);

if (profileUrl) {
  const profileSlugs = await fetchProfileSlugs(profileUrl, profileSections);
  for (const slug of profileSlugs) {
    if (!entriesBySlug.has(slug)) {
      entriesBySlug.set(slug, { slug, featured: false });
    }
  }
}

const entries = Array.from(entriesBySlug.values());

if (!entries.length) {
  console.warn("No games found in seed or profile scrape.");
  await writeFile(outputPath, "[]\n");
  process.exit(0);
}

async function fetchGame(slug) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${slug}?key=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(`RAWG request failed: ${slug} (${response.status})`);
  }

  return response.json();
}

function stripHtml(value) {
  if (!value || typeof value !== "string") return null;
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || null;
}

const output = [];

for (const entry of entries) {
  const slug = entry.slug;
  if (!slug) continue;

  const game = await fetchGame(slug);

  output.push({
    id: game.id,
    slug: game.slug,
    title: game.name,
    description: game.description_raw ?? stripHtml(game.description),
    released: game.released ?? null,
    backgroundImage: game.background_image ?? null,
    genres: game.genres?.map((genre) => genre.name) ?? [],
    developers: game.developers?.map((dev) => dev.name) ?? [],
    platforms:
      game.platforms?.map((platform) => platform.platform?.name) ?? [],
    rating: game.rating ?? null,
    metacritic: game.metacritic ?? null,
    website: game.website ?? null,
    rawgUrl: game.slug ? `https://rawg.io/games/${game.slug}` : null,
    featured: Boolean(entry.featured),
  });
}

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${output.length} games to app/data/games.json`);
