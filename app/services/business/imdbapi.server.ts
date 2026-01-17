const DEFAULT_IMDB_API_BASE_URL = "https://api.imdbapi.dev";

type AccessToken = {
  value: string;
  expiresAt?: number;
};

let cachedToken: AccessToken | null = null;

function isTokenValid(token: AccessToken | null) {
  if (!token) return false;
  if (!token.expiresAt) return true;
  return Date.now() < token.expiresAt;
}

async function fetchAccessToken(): Promise<AccessToken | null> {
  const directToken = process.env.IMDB_API_ACCESS_TOKEN;
  if (directToken) return { value: directToken };

  const tokenUrl = process.env.IMDB_API_TOKEN_URL;
  const clientId = process.env.IMDB_API_CLIENT_ID;
  const clientSecret = process.env.IMDB_API_CLIENT_SECRET;

  if (!tokenUrl || !clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) return null;

  const expiresAt = data.expires_in
    ? Date.now() + Math.max(data.expires_in - 60, 0) * 1000
    : undefined;

  return { value: data.access_token, expiresAt };
}

export async function getImdbApiAccessToken() {
  if (isTokenValid(cachedToken)) return cachedToken?.value ?? null;

  cachedToken = await fetchAccessToken();
  return cachedToken?.value ?? null;
}

export async function imdbApiFetchJson<T>(pathOrUrl: string): Promise<T> {
  const baseUrl =
    process.env.IMDB_API_BASE_URL ?? DEFAULT_IMDB_API_BASE_URL;
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

  const token = await getImdbApiAccessToken();
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`IMDb API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
