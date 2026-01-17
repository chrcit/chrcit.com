import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
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
const defaultSeedPath = path.join(root, "app/data/music.seed.json");
const defaultOutputPath = path.join(root, "app/data/music.json");

const env = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  accessToken: process.env.SPOTIFY_ACCESS_TOKEN,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  market: process.env.SPOTIFY_MARKET ?? "US",
  appleCountry: process.env.APPLE_MUSIC_COUNTRY ?? "US",
};

const intro = chalk.cyan.bold("Spotify Music Sync");
console.log(`\n${intro}`);
console.log(chalk.dim("Create structured music data for your app."));

const response = await prompts(
  [
  {
    type: "multiselect",
    name: "sources",
    message: "Pick sources to include",
    choices: [
      { title: "Playlist(s)", value: "playlist" },
      { title: "Top tracks", value: "top" },
      { title: "Seed file (music.seed.json)", value: "seed" },
    ],
    min: 1,
  },
  {
    type: (prev) => (prev?.includes("playlist") ? "text" : null),
    name: "playlistIds",
    message: "Playlist IDs (comma separated)",
    initial: process.env.SPOTIFY_PLAYLIST_ID ?? "",
  },
  {
    type: (prev, values) =>
      values.sources?.includes("top") ? "select" : null,
    name: "topRange",
    message: "Top tracks time range",
    choices: [
      { title: "Short term (4 weeks)", value: "short_term" },
      { title: "Medium term (6 months)", value: "medium_term" },
      { title: "Long term (years)", value: "long_term" },
    ],
    initial: 0,
  },
  {
    type: (prev, values) =>
      values.sources?.includes("top") ? "number" : null,
    name: "topLimit",
    message: "How many top tracks?",
    initial: 40,
    min: 1,
    max: 200,
  },
  {
    type: "confirm",
    name: "includeOembed",
    message: "Fetch Spotify oEmbed metadata for tracks/albums/artists?",
    initial: true,
  },
  {
    type: "confirm",
    name: "includeApplePreview",
    message: "Fetch Apple Music preview URLs when Spotify previews are missing?",
    initial: true,
  },
  {
    type: "text",
    name: "seedPath",
    message: "Seed file path",
    initial: defaultSeedPath,
  },
  {
    type: "text",
    name: "outputPath",
    message: "Output JSON path",
    initial: defaultOutputPath,
  },
  ],
  {
    onCancel: () => {
      console.log(chalk.yellow("Cancelled."));
      process.exit(0);
    },
  },
);

if (!response.sources || response.sources.length === 0) {
  console.log(chalk.yellow("No sources selected. Exiting."));
  process.exit(0);
}

const wantsPlaylist = response.sources.includes("playlist");
const wantsTop = response.sources.includes("top");
const wantsSeed = response.sources.includes("seed");

const playlistIds = (response.playlistIds ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const needsUser = wantsPlaylist || wantsTop;

let userToken = env.accessToken ?? null;
const tokenSpinner = ora("Resolving Spotify access token").start();
try {
  if (needsUser && !userToken) {
    const resolved = await resolveAccessToken({
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      refreshToken: env.refreshToken,
      requireUser: true,
    });
    userToken = resolved.token;
  }

  if (needsUser && userToken) {
    userToken = await ensureUserToken({
      token: userToken,
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      refreshToken: env.refreshToken,
    });
  }
  const fallbackToken = (
    userToken ??
    (await resolveAccessToken({
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      refreshToken: env.refreshToken,
    })).token
  );
  const trackFetchToken = userToken ?? fallbackToken;
  const trackMarket = userToken ? "from_token" : env.market;
  tokenSpinner.succeed(chalk.green("Access token ready."));

  const trackIds = new Set();
  const seedEntries = [];

  if (wantsPlaylist) {
    if (!playlistIds.length) {
      console.log(chalk.yellow("No playlist IDs provided."));
    } else {
      const playlistSpinner = ora("Fetching playlist tracks").start();
      for (const playlistId of playlistIds) {
        const ids = await fetchPlaylistTracks(userToken, playlistId);
        ids.forEach((id) => trackIds.add(id));
      }
      playlistSpinner.succeed(
        chalk.green(`Loaded ${trackIds.size} playlist tracks.`),
      );
    }
  }

  if (wantsTop) {
    const topSpinner = ora("Fetching top tracks").start();
    const ids = await fetchTopTracks(
      userToken,
      response.topRange ?? "short_term",
      response.topLimit ?? 40,
    );
    ids.forEach((id) => trackIds.add(id));
    topSpinner.succeed(chalk.green(`Loaded ${ids.length} top tracks.`));
  }

  if (wantsSeed) {
    const seedSpinner = ora("Resolving seed file").start();
    const seedRaw = await fs.readFile(response.seedPath, "utf-8");
    const seed = JSON.parse(seedRaw);
    if (!Array.isArray(seed)) {
      throw new Error("Seed file must be an array.");
    }

    for (const entry of seed) {
      const resolved = await resolveSeedEntry(entry, fallbackToken, trackMarket);
      if (resolved) {
        seedEntries.push(resolved);
        if (resolved.spotifyId) trackIds.add(resolved.spotifyId);
      }
    }
    seedSpinner.succeed(chalk.green(`Resolved ${seedEntries.length} seeds.`));
  }

  if (trackIds.size === 0) {
    console.log(chalk.red("No tracks found. Nothing to write."));
    process.exit(1);
  }

  const fetchSpinner = ora("Fetching track details").start();
  const rawTracks = await fetchTracksWithMarket(trackFetchToken, [...trackIds], {
    market: trackMarket,
  });
  fetchSpinner.succeed(
    chalk.green(`Fetched ${rawTracks.length} track records.`),
  );

  const applePreviewMap = response.includeApplePreview
    ? await fetchApplePreviewsForSpotifyTracks(rawTracks, {
        country: env.appleCountry,
      })
    : new Map();

  const artistIds = new Set();
  rawTracks.forEach((track) => {
    track.artists?.forEach((artist) => {
      if (artist?.id) artistIds.add(artist.id);
    });
  });

  const artistSpinner = ora("Fetching artist metadata").start();
  const artistMap = await fetchArtists(fallbackToken, [...artistIds]);
  artistSpinner.succeed(chalk.green(`Loaded ${artistMap.size} artists.`));

  let oembedMap = new Map();
  if (response.includeOembed) {
    const oembedSpinner = ora("Fetching oEmbed metadata").start();
    const oembedUrls = new Set();
    rawTracks.forEach((track) => {
      const trackUrl = track.external_urls?.spotify;
      if (trackUrl) oembedUrls.add(trackUrl);
      const albumUrl = track.album?.external_urls?.spotify;
      if (albumUrl) oembedUrls.add(albumUrl);
      track.artists?.forEach((artist) => {
        const artistUrl = artist.external_urls?.spotify;
        if (artistUrl) oembedUrls.add(artistUrl);
      });
    });
    oembedMap = await fetchOEmbed([...oembedUrls]);
    oembedSpinner.succeed(
      chalk.green(`Loaded ${oembedMap.size} oEmbed entries.`),
    );
  }

  const seedById = new Map(seedEntries.map((entry) => [entry.spotifyId, entry]));
  const structured = rawTracks
    .map((track) =>
      buildTrack(track, seedById, artistMap, oembedMap, applePreviewMap),
    )
    .sort((a, b) => a.artist.localeCompare(b.artist));

  const writeSpinner = ora("Writing output file").start();
  await fs.writeFile(
    response.outputPath,
    `${JSON.stringify(structured, null, 2)}\n`,
    "utf-8",
  );
  writeSpinner.succeed(
    chalk.green(`Wrote ${structured.length} tracks to ${response.outputPath}`),
  );
} catch (error) {
  tokenSpinner.fail(chalk.red("Spotify sync failed."));
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

async function resolveSeedEntry(entry, token, market) {
  if (entry.spotifyId) return entry;

  const query =
    entry.query ??
    (entry.title && entry.artist
      ? `track:${entry.title} artist:${entry.artist}`
      : null);

  if (!query) return null;

  const match = await searchTrack(token, query, { market });
  if (!match?.id) {
    console.log(chalk.yellow(`No match for: ${query}`));
    return null;
  }

  return {
    ...entry,
    spotifyId: match.id,
  };
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
