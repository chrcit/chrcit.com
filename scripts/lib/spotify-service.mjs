export async function resolveAccessToken({
  clientId,
  clientSecret,
  refreshToken,
  accessToken,
  requireUser,
} = {}) {
  if (accessToken) {
    return { token: accessToken, source: "env" };
  }

  if (refreshToken) {
    const token = await getAccessTokenFromRefresh({
      clientId,
      clientSecret,
      refreshToken,
    });
    return { token, source: "refresh" };
  }

  if (requireUser) {
    throw new Error(
      "A user access token is required. Set SPOTIFY_ACCESS_TOKEN or SPOTIFY_REFRESH_TOKEN.",
    );
  }

  const token = await getAccessTokenFromClientCredentials({
    clientId,
    clientSecret,
  });
  return { token, source: "client" };
}

export async function ensureUserToken({
  token,
  clientId,
  clientSecret,
  refreshToken,
} = {}) {
  if (!token) return null;
  try {
    await fetchJson("https://api.spotify.com/v1/me", token);
    return token;
  } catch (error) {
    if (isUnauthorized(error) && refreshToken) {
      return getAccessTokenFromRefresh({
        clientId,
        clientSecret,
        refreshToken,
      });
    }
    throw error;
  }
}

export async function getAccessTokenFromClientCredentials({
  clientId,
  clientSecret,
}) {
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Spotify.");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Spotify auth response missing access_token.");
  }

  return data.access_token;
}

export async function getAccessTokenFromRefresh({
  clientId,
  clientSecret,
  refreshToken,
}) {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REFRESH_TOKEN.",
    );
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token.");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Spotify refresh response missing access_token.");
  }

  return data.access_token;
}

export async function fetchJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Spotify fetch failed (${response.status}) for ${url}: ${message}`);
  }

  return response.json();
}

export function isUnauthorized(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /\\b401\\b/.test(message);
}

export async function searchTrack(token, query, { market } = {}) {
  const marketParam = market ? `&market=${encodeURIComponent(market)}` : "";
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1${marketParam}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Spotify search failed for ${query}.`);
  }

  const data = await response.json();
  return data.tracks?.items?.[0] ?? null;
}

export async function fetchTracks(token, ids) {
  return fetchTracksWithMarket(token, ids);
}

export async function fetchTracksWithMarket(token, ids, { market } = {}) {
  const marketParam = market ? `&market=${encodeURIComponent(market)}` : "";
  const chunks = chunk(ids, 50);
  const tracks = [];

  for (const group of chunks) {
    const data = await fetchJson(
      `https://api.spotify.com/v1/tracks?ids=${group.join(",")}${marketParam}`,
      token,
    );
    for (const track of data.tracks ?? []) {
      if (track) tracks.push(track);
    }
  }

  return tracks;
}

export async function fetchArtists(token, ids) {
  const map = new Map();
  const chunks = chunk(ids, 50);

  for (const group of chunks) {
    const data = await fetchJson(
      `https://api.spotify.com/v1/artists?ids=${group.join(",")}`,
      token,
    );
    for (const artist of data.artists ?? []) {
      if (!artist?.id) continue;
      map.set(artist.id, artist);
    }
  }

  return map;
}

export async function fetchPlaylistTracks(token, playlistId) {
  const ids = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(id)),next`;

  while (url) {
    const data = await fetchJson(url, token);
    for (const item of data.items ?? []) {
      const id = item?.track?.id;
      if (id) ids.push(id);
    }
    url = data.next;
  }

  return ids;
}

export async function fetchTopTracks(token, range, limit) {
  const ids = [];
  const batchSize = Math.min(50, limit);
  let offset = 0;

  while (offset < limit) {
    const data = await fetchJson(
      `https://api.spotify.com/v1/me/top/tracks?limit=${batchSize}&offset=${offset}&time_range=${range}`,
      token,
    );
    for (const item of data.items ?? []) {
      if (item?.id) ids.push(item.id);
    }
    if (!data.next) break;
    offset += batchSize;
  }

  return ids;
}

export async function fetchOEmbed(urls, { concurrency = 8 } = {}) {
  const map = new Map();
  const queue = urls.filter(Boolean);

  while (queue.length) {
    const batch = queue.splice(0, concurrency);
    const results = await Promise.all(
      batch.map(async (url) => {
        try {
          const response = await fetch(
            `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
          );
          if (!response.ok) return null;
          return { url, data: await response.json() };
        } catch (error) {
          return null;
        }
      }),
    );

    for (const result of results) {
      if (!result) continue;
      map.set(result.url, result.data);
    }
  }

  return map;
}

export function chunk(items, size) {
  return items.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(item);
    return acc;
  }, []);
}

export function normalizeGenres(genres) {
  const normalized = new Set();

  for (const genre of genres) {
    const lower = genre.toLowerCase();
    if (lower.includes("german hip hop") || lower.includes("deutschrap")) {
      normalized.add("Deutschrap");
      continue;
    }
    if (lower.includes("hip hop") || lower.includes("rap")) {
      normalized.add("Hip Hop");
      continue;
    }
    if (lower.includes("pop")) {
      normalized.add("Pop");
      continue;
    }
    if (
      lower.includes("electronic") ||
      lower.includes("edm") ||
      lower.includes("electro") ||
      lower.includes("dance") ||
      lower.includes("house") ||
      lower.includes("techno") ||
      lower.includes("disco") ||
      lower.includes("synth")
    ) {
      normalized.add("Electronic");
    }
  }

  return Array.from(normalized);
}

export function uniq(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function paletteFromId(value) {
  let hash = 0;
  for (const char of value) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  const altHue = (hue + 70) % 360;
  return [`hsl(${hue} 80% 55%)`, `hsl(${altHue} 70% 45%)`];
}
