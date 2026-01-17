import fs from "node:fs/promises";
import path from "node:path";
import {
  ensureUserToken,
  fetchArtists,
  fetchOEmbed,
  fetchPlaylistTracks,
  fetchTopTracks,
  fetchTracksWithMarket,
  normalizeGenres,
  paletteFromId,
  resolveAccessToken,
  searchTrack,
  slugify,
  uniq,
} from "./lib/spotify-service.mjs";
import { fetchApplePreviewsForSpotifyTracks } from "./lib/apple-music-service.mjs";

const root = process.cwd();
const seedPath = path.join(root, "app/data/music.seed.json");
const outputPath = path.join(root, "app/data/music.json");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const market = process.env.SPOTIFY_MARKET ?? "US";
const appleCountry = process.env.APPLE_MUSIC_COUNTRY ?? "US";
const includeApplePreview = process.env.APPLE_PREVIEW !== "false";
const playlistIds = (process.env.SPOTIFY_PLAYLIST_ID ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const includeTop =
  Boolean(accessToken || refreshToken) &&
  process.env.SPOTIFY_INCLUDE_TOP !== "false";
const topRange = process.env.SPOTIFY_TOP_RANGE ?? "short_term";
const topLimit = Number.parseInt(process.env.SPOTIFY_TOP_LIMIT ?? "40", 10);

const seedRaw = await fs.readFile(seedPath, "utf-8");
const seed = JSON.parse(seedRaw);

if (!Array.isArray(seed)) {
  console.error("app/data/music.seed.json must be an array.");
  process.exit(1);
}

const needsUser = playlistIds.length > 0 || includeTop;
let userToken = accessToken ?? null;

if (needsUser && !userToken) {
  try {
    const resolved = await resolveAccessToken({
      clientId,
      clientSecret,
      refreshToken,
      requireUser: true,
    });
    userToken = resolved.token;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (needsUser && userToken) {
  try {
    userToken = await ensureUserToken({
      token: userToken,
      clientId,
      clientSecret,
      refreshToken,
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

const apiToken = (
  userToken ??
  (await resolveAccessToken({
    clientId,
    clientSecret,
    refreshToken,
  })).token
);
const trackFetchToken = userToken ?? apiToken;
const trackMarket = userToken ? "from_token" : market;

const trackIds = new Set();
const resolvedSeeds = [];

if (userToken && playlistIds.length > 0) {
  for (const playlistId of playlistIds) {
    const playlistTracks = await fetchPlaylistTracks(userToken, playlistId);
    for (const id of playlistTracks) trackIds.add(id);
  }
}

if (userToken && includeTop) {
  const topTracks = await fetchTopTracks(userToken, topRange, topLimit);
  for (const id of topTracks) trackIds.add(id);
}

for (const entry of seed) {
  const resolved = await resolveSeedEntry(entry, apiToken, trackMarket);
  if (resolved) {
    resolvedSeeds.push(resolved);
    if (resolved.spotifyId) trackIds.add(resolved.spotifyId);
  }
}

if (trackIds.size === 0) {
  console.error(
    "No tracks resolved. Provide SPOTIFY_PLAYLIST_ID or SPOTIFY_ACCESS_TOKEN, or add items to app/data/music.seed.json.",
  );
  process.exit(1);
}

const seedById = new Map(resolvedSeeds.map((entry) => [entry.spotifyId, entry]));
const rawTracks = await fetchTracksWithMarket(trackFetchToken, [...trackIds], {
  market: trackMarket,
});
const applePreviewMap = includeApplePreview
  ? await fetchApplePreviewsForSpotifyTracks(rawTracks, {
      country: appleCountry,
    })
  : new Map();
const artistIds = new Set();

for (const track of rawTracks) {
  for (const artist of track.artists ?? []) {
    if (artist?.id) artistIds.add(artist.id);
  }
}

const artistMap = await fetchArtists(apiToken, [...artistIds]);

const oembedUrls = new Set();
for (const track of rawTracks) {
  const trackUrl = track.external_urls?.spotify;
  if (trackUrl) oembedUrls.add(trackUrl);
  const albumUrl = track.album?.external_urls?.spotify;
  if (albumUrl) oembedUrls.add(albumUrl);
  for (const artist of track.artists ?? []) {
    const artistUrl = artist.external_urls?.spotify;
    if (artistUrl) oembedUrls.add(artistUrl);
  }
}

const oembedMap = await fetchOEmbed([...oembedUrls]);

const tracks = rawTracks.map((track) =>
  buildTrack(track, seedById, artistMap, oembedMap, applePreviewMap),
);
tracks.sort((a, b) => a.artist.localeCompare(b.artist));

await fs.writeFile(outputPath, `${JSON.stringify(tracks, null, 2)}\n`, "utf-8");
console.log(`Updated ${outputPath} with ${tracks.length} tracks.`);

async function resolveSeedEntry(entry, token, market) {
  if (entry.spotifyId) return entry;

  const query =
    entry.query ??
    (entry.title && entry.artist
      ? `track:${entry.title} artist:${entry.artist}`
      : null);

  if (!query) return null;

  try {
    const match = await searchTrack(token, query, { market });
    if (!match?.id) {
      console.warn(`No Spotify match found for query: ${query}`);
      return null;
    }
    return { ...entry, spotifyId: match.id };
  } catch (error) {
    console.warn(`Spotify search failed for ${query}.`);
    return null;
  }
}

function buildTrack(track, seedById, artistMap, oembedMap, applePreviewMap) {
  const seedEntry = seedById.get(track.id) ?? {};
  const artists = track.artists ?? [];
  const artistNames = artists.map((artist) => artist.name);
  const rawGenres = new Set();

  for (const artist of artists) {
    const artistGenres = artistMap.get(artist.id)?.genres ?? [];
    for (const genre of artistGenres) rawGenres.add(genre);
  }

  const artistGenres = Array.from(rawGenres).sort();
  const normalizedGenres = normalizeGenres(artistGenres);
  const seedGenres = seedEntry.genres ?? [];
  const genres = uniq([...seedGenres, ...normalizedGenres]);
  const palette = seedEntry.palette ?? paletteFromId(track.id);
  const tile = seedEntry.tile ?? "classic";
  const trackUrl = track.external_urls?.spotify ?? "";
  const albumUrl = track.album?.external_urls?.spotify ?? "";

  const applePreview = applePreviewMap?.get(track.id) ?? null;
  const spotifyPreview = track.preview_url ?? "";
  const previewUrl = spotifyPreview || applePreview?.previewUrl || "";
  const previewSource = spotifyPreview
    ? "spotify"
    : applePreview?.previewUrl
      ? "apple"
      : "none";

  return {
    id: seedEntry.id ?? slugify(`${artistNames.join("-")}-${track.name}`),
    spotifyId: track.id,
    spotifyUrl: trackUrl,
    title: track.name,
    artist: artistNames.join(", "),
    artists: artists.map((artist) => {
      const artistInfo = artistMap.get(artist.id) ?? {};
      const url = artist.external_urls?.spotify ?? "";
      return {
        id: artist.id,
        name: artist.name,
        url,
        genres: artistInfo.genres ?? [],
        oembed: url ? oembedMap.get(url) ?? null : null,
      };
    }),
    album: track.album?.name ?? "",
    albumId: track.album?.id ?? "",
    albumUrl,
    albumOembed: albumUrl ? oembedMap.get(albumUrl) ?? null : null,
    coverUrl: track.album?.images?.[0]?.url ?? "",
    previewUrl,
    previewSource,
    applePreviewUrl: applePreview?.previewUrl ?? "",
    appleTrackUrl: applePreview?.trackViewUrl ?? "",
    appleArtworkUrl: applePreview?.artworkUrl100 ?? "",
    genres,
    artistGenres,
    palette,
    tile,
    year: track.album?.release_date
      ? Number.parseInt(track.album.release_date.slice(0, 4), 10)
      : undefined,
    trackOembed: trackUrl ? oembedMap.get(trackUrl) ?? null : null,
  };
}
