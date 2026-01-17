import fs from "node:fs/promises";
import { fallbackFilmSeeds, type FilmSeed } from "~/data/films";
import { imdbApiFetchJson } from "~/services/business/imdbapi.server";

const DEFAULT_LETTERBOXD_USERNAME = "chrcit";
const LETTERBOXD_BASE_URL = "https://letterboxd.com";
const LETTERBOXD_DETAIL_CONCURRENCY = 4;
const GENERATED_FILMS_URL = new URL("./films.generated.json", import.meta.url);

const LETTERBOXD_HEADERS = {
  accept: "text/html",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
};

type ImdbImage = {
  url?: string;
  width?: number;
  height?: number;
  type?: string;
};

type ImdbName = {
  id?: string;
  displayName?: string;
};

type ImdbTitle = {
  id?: string;
  type?: string;
  primaryTitle?: string;
  originalTitle?: string;
  primaryImage?: ImdbImage;
  startYear?: number;
  endYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  plot?: string;
  directors?: ImdbName[];
  writers?: ImdbName[];
  stars?: ImdbName[];
};

type ImdbSearchResponse = {
  titles?: ImdbTitle[];
};

type ImdbBatchResponse = {
  titles?: ImdbTitle[];
};

export type FilmRecord = {
  id?: string;
  title: string;
  year?: number;
  genres: string[];
  director?: string;
  directors: string[];
  rating?: number;
  letterboxdSlug?: string;
  posterUrl?: string;
  posterWidth?: number;
  posterHeight?: number;
  plot?: string;
};

export type FetchMode = "letterboxd-imdb" | "letterboxd-only" | "imdb-only";

export type FilmFetchOptions = {
  mode?: FetchMode;
  letterboxdUser?: string;
  includeUnrated?: boolean;
  onProgress?: (step: string, detail?: string) => void;
};

type LetterboxdSeed = FilmSeed & {
  letterboxdSlug?: string;
  rating?: number;
};

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker(),
  );

  await Promise.all(workers);
  return results;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: LETTERBOXD_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Failed to load Letterboxd page: ${response.status}`);
  }

  return response.text();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function parseTitleAndYear(raw: string) {
  const match = raw.match(/^(.*)\s\((\d{4})\)$/);
  if (!match) return { title: raw.trim(), year: undefined };

  return {
    title: match[1]?.trim() ?? raw.trim(),
    year: Number(match[2]),
  };
}

function parseLetterboxdFilms(
  html: string,
  includeUnrated: boolean,
): LetterboxdSeed[] {
  const films: LetterboxdSeed[] = [];
  const regex =
    /data-item-name="([^"]+)"[^>]*data-item-slug="([^"]+)"[\s\S]*?<p class="poster-viewingdata"[^>]*>([\s\S]*?)<\/p>/g;

  for (const match of html.matchAll(regex)) {
    const name = decodeHtml(match[1] ?? "");
    const slug = match[2];
    const ratingMatch = match[3]?.match(/rated-(\d+)/);
    const ratingValue = ratingMatch ? Number(ratingMatch[1]) / 2 : undefined;
    const { title, year } = parseTitleAndYear(name);
    const rating = ratingValue && ratingValue > 0 ? ratingValue : undefined;

    if (!includeUnrated && !rating) continue;

    films.push({
      title,
      year,
      rating,
      letterboxdSlug: slug,
    });
  }

  return films;
}

function parseTotalPages(html: string, username: string) {
  let total = 1;
  const regex = new RegExp(`/${username}/films/page/(\\d+)/`, "g");
  for (const match of html.matchAll(regex)) {
    const page = Number(match[1]);
    if (Number.isFinite(page)) total = Math.max(total, page);
  }
  return total;
}

function extractImdbId(html: string) {
  const metaMatch = html.match(/data-imdb-id="(tt\d+)"/);
  if (metaMatch?.[1]) return metaMatch[1];

  const linkMatch = html.match(/imdb\.com\/title\/(tt\d+)/);
  if (linkMatch?.[1]) return linkMatch[1];

  return undefined;
}

async function fetchLetterboxdImdbId(slug?: string) {
  if (!slug) return undefined;
  const html = await fetchHtml(`${LETTERBOXD_BASE_URL}/film/${slug}/`);
  return extractImdbId(html);
}

async function fetchLetterboxdSeeds(options: {
  username: string;
  includeUnrated: boolean;
  resolveImdbIds: boolean;
  onProgress?: FilmFetchOptions["onProgress"];
}): Promise<LetterboxdSeed[]> {
  const firstPage = await fetchHtml(
    `${LETTERBOXD_BASE_URL}/${options.username}/films/`,
  );

  const totalPages = parseTotalPages(firstPage, options.username);
  const films = new Map<string, LetterboxdSeed>();
  const addFilms = (items: LetterboxdSeed[]) => {
    for (const film of items) {
      const key = film.letterboxdSlug ?? film.title;
      if (!films.has(key)) {
        films.set(key, film);
      }
    }
  };

  options.onProgress?.("letterboxd", `Page 1/${totalPages}`);
  addFilms(parseLetterboxdFilms(firstPage, options.includeUnrated));

  for (let page = 2; page <= totalPages; page += 1) {
    options.onProgress?.("letterboxd", `Page ${page}/${totalPages}`);
    const html = await fetchHtml(
      `${LETTERBOXD_BASE_URL}/${options.username}/films/page/${page}/`,
    );
    addFilms(parseLetterboxdFilms(html, options.includeUnrated));
  }

  let seeds = Array.from(films.values());

  if (options.resolveImdbIds) {
    options.onProgress?.("letterboxd", "Resolving IMDb IDs");
    seeds = await mapWithLimit(
      seeds,
      LETTERBOXD_DETAIL_CONCURRENCY,
      async (seed) => {
        if (seed.imdbId) return seed;
        const imdbId = await fetchLetterboxdImdbId(seed.letterboxdSlug);
        return { ...seed, imdbId };
      },
    );
  }

  return seeds;
}

function pickSearchMatch(seed: FilmSeed, titles: ImdbTitle[]) {
  if (titles.length === 0) return null;

  const movieCandidates = titles.filter((title) =>
    (title.type ?? "").toLowerCase().includes("movie"),
  );

  const byYear = seed.year
    ? movieCandidates.find((title) => title.startYear === seed.year)
    : null;

  return byYear ?? movieCandidates[0] ?? titles[0];
}

async function resolveSeedIds<T extends FilmSeed>(
  seeds: T[],
  onProgress?: FilmFetchOptions["onProgress"],
) {
  const resolved = await Promise.all(
    seeds.map(async (seed) => {
      if (seed.imdbId) return seed;

      onProgress?.("imdb", `Search ${seed.title}`);
      const search = await imdbApiFetchJson<ImdbSearchResponse>(
        `/search/titles?query=${encodeURIComponent(seed.title)}&limit=5`,
      );

      const match = pickSearchMatch(seed, search.titles ?? []);
      return { ...seed, imdbId: match?.id };
    }),
  );

  return resolved;
}

async function fetchTitlesByIds(
  ids: string[],
  onProgress?: FilmFetchOptions["onProgress"],
) {
  const uniqueIds = Array.from(new Set(ids));
  const batches = chunk(uniqueIds, 5);
  const titles: ImdbTitle[] = [];

  for (const batch of batches) {
    const params = batch
      .map((id) => `titleIds=${encodeURIComponent(id)}`)
      .join("&");

    onProgress?.(
      "imdb",
      `Batch ${titles.length + 1}-${titles.length + batch.length}`,
    );
    const response = await imdbApiFetchJson<ImdbBatchResponse>(
      `/titles:batchGet?${params}`,
    );

    titles.push(...(response.titles ?? []));
  }

  return titles;
}

function mapSeedsToFilmRecords(seeds: LetterboxdSeed[]): FilmRecord[] {
  return seeds.map((seed) => ({
    id: seed.imdbId,
    title: seed.title ?? "Untitled",
    year: seed.year,
    genres: [],
    director: undefined,
    directors: [],
    rating: seed.rating,
    letterboxdSlug: seed.letterboxdSlug,
  }));
}

export async function fetchFilmsFromSources(
  options: FilmFetchOptions = {},
): Promise<FilmRecord[]> {
  const mode = options.mode ?? "letterboxd-imdb";
  const username = options.letterboxdUser ?? DEFAULT_LETTERBOXD_USERNAME;
  const includeUnrated = options.includeUnrated ?? false;

  if (mode === "imdb-only") {
    const resolvedSeeds = await resolveSeedIds(
      fallbackFilmSeeds,
      options.onProgress,
    );
    const ids = resolvedSeeds
      .map((seed) => seed.imdbId)
      .filter((id): id is string => Boolean(id));

    const titles = await fetchTitlesByIds(ids, options.onProgress);
    const titleMap = new Map(titles.map((title) => [title.id ?? "", title]));

    return resolvedSeeds.map<FilmRecord>((seed) => {
      const title = seed.imdbId ? titleMap.get(seed.imdbId) : undefined;
      const directors = (title?.directors ?? [])
        .map((director) => director.displayName)
        .filter(Boolean) as string[];

      return {
        id: seed.imdbId ?? title?.id,
        title:
          title?.primaryTitle ??
          title?.originalTitle ??
          seed.title ??
          "Untitled",
        year: title?.startYear ?? seed.year,
        genres: title?.genres ?? [],
        director: directors[0] ?? "Unknown",
        directors,
        rating: seed.rating,
        letterboxdSlug: seed.letterboxdSlug,
        posterUrl: title?.primaryImage?.url,
        posterWidth: title?.primaryImage?.width,
        posterHeight: title?.primaryImage?.height,
        plot: title?.plot,
      };
    });
  }

  const letterboxdSeeds = await fetchLetterboxdSeeds({
    username,
    includeUnrated,
    resolveImdbIds: mode === "letterboxd-imdb",
    onProgress: options.onProgress,
  });

  if (mode === "letterboxd-only") {
    return mapSeedsToFilmRecords(letterboxdSeeds);
  }

  const resolvedSeeds = await resolveSeedIds(
    letterboxdSeeds,
    options.onProgress,
  );
  const ids = resolvedSeeds
    .map((seed) => seed.imdbId)
    .filter((id): id is string => Boolean(id));

  const titles = await fetchTitlesByIds(ids, options.onProgress);
  const titleMap = new Map(titles.map((title) => [title.id ?? "", title]));

  return resolvedSeeds.map<FilmRecord>((seed) => {
    const title = seed.imdbId ? titleMap.get(seed.imdbId) : undefined;
    const directors = (title?.directors ?? [])
      .map((director) => director.displayName)
      .filter(Boolean) as string[];

    return {
      id: seed.imdbId ?? title?.id,
      title:
        title?.primaryTitle ?? title?.originalTitle ?? seed.title ?? "Untitled",
      year: title?.startYear ?? seed.year,
      genres: title?.genres ?? [],
      director: directors[0] ?? "Unknown",
      directors,
      rating: seed.rating,
      letterboxdSlug: seed.letterboxdSlug,
      posterUrl: title?.primaryImage?.url,
      posterWidth: title?.primaryImage?.width,
      posterHeight: title?.primaryImage?.height,
      plot: title?.plot,
    };
  });
}

export async function fetchFilms(): Promise<FilmRecord[]> {
  try {
    const file = await fs.readFile(GENERATED_FILMS_URL, "utf8");
    return JSON.parse(file) as FilmRecord[];
  } catch (error) {
    const { code } = error as NodeJS.ErrnoException;
    if (code === "ENOENT") {
      throw new Error(
        "Missing app/data/films.generated.json. Run npm run films:sync first.",
      );
    }
    throw error;
  }
}
