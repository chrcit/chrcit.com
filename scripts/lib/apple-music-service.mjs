export async function fetchApplePreviewsForSpotifyTracks(
  tracks,
  { country = "US", concurrency = 6 } = {},
) {
  const results = new Map();
  const queue = tracks.filter((track) => !track?.preview_url);

  for (let i = 0; i < queue.length; i += concurrency) {
    const batch = queue.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (track) => {
        const term = buildSearchTerm(track);
        if (!term) return { id: track.id, data: null };
        try {
          const data = await searchAppleMusic({ term, country });
          const match = pickBestAppleMatch(track, data.results ?? []);
          return {
            id: track.id,
            data: match
              ? {
                  previewUrl: match.previewUrl ?? "",
                  trackViewUrl: match.trackViewUrl ?? "",
                  artworkUrl100: match.artworkUrl100 ?? "",
                  trackId: match.trackId ?? null,
                  artistName: match.artistName ?? "",
                  collectionName: match.collectionName ?? "",
                }
              : null,
          };
        } catch (error) {
          return { id: track.id, data: null };
        }
      }),
    );

    for (const result of batchResults) {
      results.set(result.id, result.data);
    }
  }

  return results;
}

export async function searchAppleMusic({ term, country = "US" } = {}) {
  if (!term) {
    return { resultCount: 0, results: [] };
  }
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    term,
  )}&entity=song&limit=5&country=${encodeURIComponent(country)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Apple Music search failed: ${response.status}`);
  }
  return response.json();
}

function buildSearchTerm(track) {
  const title = track?.name ?? track?.title ?? "";
  const artist = track?.artists?.[0]?.name ?? "";
  const album = track?.album?.name ?? "";
  return [title, artist, album].filter(Boolean).join(" ").trim();
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(track, result) {
  const title = normalize(track?.name ?? "");
  const artist = normalize(track?.artists?.[0]?.name ?? "");
  const album = normalize(track?.album?.name ?? "");
  const resultTitle = normalize(result.trackName ?? "");
  const resultArtist = normalize(result.artistName ?? "");
  const resultAlbum = normalize(result.collectionName ?? "");

  let score = 0;
  if (title && resultTitle === title) score += 4;
  if (title && resultTitle.includes(title)) score += 2;
  if (artist && resultArtist === artist) score += 3;
  if (artist && resultArtist.includes(artist)) score += 1;
  if (album && resultAlbum.includes(album)) score += 1;

  return score;
}

function pickBestAppleMatch(track, results) {
  if (!Array.isArray(results) || results.length === 0) return null;
  let best = results[0];
  let bestScore = scoreMatch(track, best);

  for (let i = 1; i < results.length; i += 1) {
    const score = scoreMatch(track, results[i]);
    if (score > bestScore) {
      bestScore = score;
      best = results[i];
    }
  }

  return bestScore > 0 ? best : results[0];
}
