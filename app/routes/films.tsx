import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/films";
import { fetchFilms, type FilmRecord } from "~/data/films.server";

export function meta() {
  return [
    { title: "Films · Christian Cito" },
    {
      name: "description",
      content:
        "A curated film shelf with directors, genres, and poster art to browse.",
    },
  ];
}

export async function loader() {
  const films = await fetchFilms();
  return { films };
}

const groupOptions = [
  { value: "none", label: "None" },
  { value: "genre", label: "Genre" },
  { value: "director", label: "Director" },
] as const;

type GroupOption = (typeof groupOptions)[number]["value"];

const cardShadow =
  "shadow-[0_30px_80px_-60px_rgba(0,0,0,0.85),0_12px_30px_-24px_rgba(0,0,0,0.6)]";

function filmMatchesQuery(film: FilmRecord, query: string) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return (
    film.title.toLowerCase().includes(normalized) ||
    film.directors.some((director) =>
      director.toLowerCase().includes(normalized),
    ) ||
    film.genres.some((genre) => genre.toLowerCase().includes(normalized))
  );
}

function groupKeyForFilm(film: FilmRecord, groupBy: GroupOption) {
  if (groupBy === "genre") {
    return film.genres[0] ?? "Uncategorized";
  }
  if (groupBy === "director") {
    return film.director ?? "Unknown";
  }
  return "All films";
}

function formatRating(rating?: number) {
  if (!rating) return null;
  const formatted = Number.isInteger(rating)
    ? `${rating}`
    : rating.toFixed(1);
  return `${formatted}/5`;
}

export default function Films({ loaderData }: Route.ComponentProps) {
  const { films } = loaderData;
  const [groupBy, setGroupBy] = useState<GroupOption>("none");
  const [genreFilter, setGenreFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "coverflow">("grid");
  const [barExpanded, setBarExpanded] = useState(true);
  const coverflowRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  const genreOptions = useMemo(() => {
    const counts = new Map<string, number>();
    films.forEach((film) => {
      film.genres.forEach((genre) => {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .map(([genre]) => genre);
  }, [films]);

  const filteredFilms = useMemo(() => {
    return films.filter((film) => {
      if (!filmMatchesQuery(film, query)) return false;
      if (genreFilter === "All") return true;
      return film.genres.includes(genreFilter);
    });
  }, [films, genreFilter, query]);

  const sortedFilms = useMemo(() => {
    if (groupBy === "none") {
      return [...filteredFilms].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }

    return [...filteredFilms].sort((a, b) => {
      const groupA = groupKeyForFilm(a, groupBy);
      const groupB = groupKeyForFilm(b, groupBy);
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      return a.title.localeCompare(b.title);
    });
  }, [filteredFilms, groupBy]);

  const activeFilm = sortedFilms[activeIndex];

  useEffect(() => {
    const updateBarState = () => {
      setBarExpanded(window.innerWidth >= 768);
    };
    updateBarState();
    window.addEventListener("resize", updateBarState);
    return () => window.removeEventListener("resize", updateBarState);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (viewMode === "coverflow") {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [viewMode]);

  const handleCoverflowScroll = () => {
    if (!coverflowRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const container = coverflowRef.current;
      if (!container) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(itemCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    });
  };

  const scrollToIndex = (index: number) => {
    const container = coverflowRef.current;
    const target = itemRefs.current[index];
    if (!container || !target) return;
    target.scrollIntoView({ behavior: "smooth", inline: "center" });
    setActiveIndex(index);
  };

  const openCoverflow = (index: number) => {
    setActiveIndex(index);
    setViewMode("coverflow");
    setBarExpanded(window.innerWidth >= 768);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToIndex(index));
    });
  };

  const closeCoverflow = () => {
    setViewMode("grid");
  };

  const goToNext = () => {
    const nextIndex =
      activeIndex + 1 >= sortedFilms.length ? 0 : activeIndex + 1;
    scrollToIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex =
      activeIndex - 1 < 0 ? sortedFilms.length - 1 : activeIndex - 1;
    scrollToIndex(prevIndex);
  };

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col gap-3 overflow-hidden">
      <header className="flex h-20 items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-black/45 px-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.34em] text-white/45">
              Film archive
            </p>
            <h1 className="font-[var(--font-display)] text-lg font-semibold text-[color:var(--color-ink)]">
              Films
            </h1>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-white/50 md:inline">
            {filteredFilms.length} titles
          </span>
        </div>

        <div className="flex w-full max-w-xl items-center justify-end gap-3 overflow-x-auto md:overflow-visible">
          <label className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.32em] text-white/50">
            Group
            <select
              value={groupBy}
              onChange={(event) =>
                setGroupBy(event.target.value as GroupOption)
              }
              className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.32em] text-white/50">
            Genre
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
              className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70"
            >
              {["All", ...genreOptions].map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.32em] text-white/50">
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="w-40 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white placeholder:text-white/40 focus:border-[color:var(--color-brand)] focus:ring-2 focus:ring-[color:var(--color-brand)]"
            />
          </label>
        </div>
      </header>

      {filteredFilms.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-white/60">
          No films match the current filters.
        </div>
      ) : (
        <section className="flex min-h-0 flex-1 flex-col gap-4">
          {viewMode === "grid" ? (
            <div className="scrollbar-min min-h-0 flex-1 overflow-y-auto rounded-[1.6rem] border border-white/10 bg-black/30 p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedFilms.map((film, index) => {
                  const ratingLabel = formatRating(film.rating);

                  return (
                    <button
                      key={film.id ?? film.title}
                      type="button"
                      onClick={() => openCoverflow(index)}
                      className="group text-left"
                    >
                      <div className={`relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/40 ${cardShadow}`}>
                        {film.posterUrl ? (
                          <img
                            src={film.posterUrl}
                            alt={film.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            style={{
                              aspectRatio:
                                film.posterWidth && film.posterHeight
                                  ? `${film.posterWidth}/${film.posterHeight}`
                                  : "2/3",
                            }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center bg-gradient-to-br from-white/15 via-white/5 to-black/40 text-center text-xs uppercase tracking-[0.3em] text-white/70"
                            style={{ aspectRatio: "2/3" }}
                          >
                            Poster pending
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                        {ratingLabel ? (
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                            {ratingLabel}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-semibold text-[color:var(--color-ink)]">
                          {film.title}
                        </p>
                        <p className="text-xs text-white/60">
                          {film.director ?? "Unknown"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black">
                {activeFilm?.posterUrl && (
                  <div
                    className="absolute inset-0 scale-105 bg-cover bg-center blur-[42px] saturate-150"
                    style={{ backgroundImage: `url(${activeFilm.posterUrl})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
              </div>

              <div className="relative flex h-full flex-col">
                <div className="min-h-0 flex-1">
                  <div
                    ref={coverflowRef}
                    onScroll={handleCoverflowScroll}
                    className="scrollbar-min flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-6 py-8"
                  >
                    {sortedFilms.map((film, index) => {
                      const ratingLabel = formatRating(film.rating);
                      const groupLabel =
                        groupBy === "none"
                          ? null
                          : groupKeyForFilm(film, groupBy);

                      return (
                        <article
                          key={film.id ?? film.title}
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          className="scrollbar-min relative h-full min-w-full snap-center overflow-y-auto overscroll-y-contain px-6 py-8 md:px-10 md:py-10"
                        >
                          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
                            <div className="relative w-full max-w-sm shrink-0 lg:sticky lg:top-6 lg:h-[calc(100dvh-30vh-6rem)] lg:max-h-[calc(100dvh-30vh-6rem)] lg:w-auto lg:max-w-none">
                              {ratingLabel ? (
                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                                  {ratingLabel}
                                </span>
                              ) : null}
                              {film.posterUrl ? (
                                <img
                                  src={film.posterUrl}
                                  alt={film.title}
                                  loading="lazy"
                                  className="w-full rounded-[1.4rem] object-cover lg:h-full lg:w-auto lg:mx-auto"
                                  style={{
                                    aspectRatio:
                                      film.posterWidth && film.posterHeight
                                        ? `${film.posterWidth}/${film.posterHeight}`
                                        : "2/3",
                                  }}
                                />
                              ) : (
                                <div
                                  className="flex items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-white/15 via-white/5 to-black/40 text-center text-xs uppercase tracking-[0.3em] text-white/70"
                                  style={{ aspectRatio: "2/3" }}
                                >
                                  Poster pending
                                </div>
                              )}
                            </div>

                            <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-black/40 p-5 backdrop-blur-2xl md:p-6">
                              {groupLabel ? (
                                <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.32em] text-white/60">
                                  {groupLabel}
                                </span>
                              ) : null}
                              <div className="space-y-2">
                                <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[color:var(--color-ink)] md:text-4xl">
                                  {film.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/55">
                                  <span>{film.director ?? "Unknown"}</span>
                                  {film.year ? (
                                    <span className="rounded-full border border-white/10 px-3 py-1">
                                      {film.year}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              {film.plot ? (
                                <p className="max-w-2xl text-sm text-white/70">
                                  {film.plot}
                                </p>
                              ) : null}
                              <div className="flex flex-wrap gap-2">
                                {film.genres.map((genre) => (
                                  <span
                                    key={`${film.title}-${genre}`}
                                    className="rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white/55"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`overflow-hidden border-t border-white/10 bg-black/70 backdrop-blur-xl ${
                    barExpanded ? "h-[30vh] min-h-[180px]" : "h-16"
                  }`}
                >
                  <div className="flex h-16 items-center justify-between px-4">
                    <div
                      className={`space-y-1 ${
                        barExpanded ? "block" : "hidden md:block"
                      }`}
                    >
                      <p className="text-[0.55rem] uppercase tracking-[0.34em] text-white/45">
                        Now viewing
                      </p>
                      <p className="text-sm text-white/80">
                        {activeFilm?.title ?? "Film"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPrev}
                        className="pressable rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        className="pressable rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white"
                      >
                        →
                      </button>
                      {activeFilm?.letterboxdSlug ? (
                        <a
                          href={`https://letterboxd.com/film/${activeFilm.letterboxdSlug}/`}
                          target="_blank"
                          rel="noreferrer"
                          className={`pressable rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white ${
                            barExpanded ? "" : "hidden md:inline-flex"
                          }`}
                        >
                          Letterboxd
                        </a>
                      ) : null}
                      {activeFilm?.id ? (
                        <a
                          href={`https://www.imdb.com/title/${activeFilm.id}/`}
                          target="_blank"
                          rel="noreferrer"
                          className={`pressable rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white ${
                            barExpanded ? "" : "hidden md:inline-flex"
                          }`}
                        >
                          IMDb
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={closeCoverflow}
                        className={`pressable rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white ${
                          barExpanded ? "" : "hidden md:inline-flex"
                        }`}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => setBarExpanded((prev) => !prev)}
                        className="pressable rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white md:hidden"
                        aria-expanded={barExpanded}
                      >
                        {barExpanded ? "▾" : "▴"}
                      </button>
                    </div>
                  </div>

                  {barExpanded && (
                    <div className="scrollbar-min h-[calc(30vh-4rem)] overflow-x-auto overscroll-x-contain px-4 pb-4">
                    <div className="grid h-full auto-cols-[minmax(140px,1fr)] grid-flow-col grid-rows-1 gap-3 pl-2 snap-x snap-mandatory">
                        {sortedFilms.map((film, index) => {
                          const isActive = index === activeIndex;
                          const ratingLabel = formatRating(film.rating);

                          return (
                            <button
                              key={`${film.id ?? film.title}-thumb`}
                              type="button"
                              onClick={() => scrollToIndex(index)}
                              className={`group relative overflow-hidden rounded-[1rem] border text-left transition snap-start ${
                                isActive
                                  ? "border-[color:var(--color-brand)] bg-white/10"
                                  : "border-white/10 bg-black/30 hover:border-white/30"
                              }`}
                            >
                              {film.posterUrl ? (
                                <img
                                  src={film.posterUrl}
                                  alt={film.title}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-black/60 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
                                  Missing
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                              <div className="absolute inset-x-2 bottom-2 space-y-1 text-xs text-white/80">
                                <p className="truncate font-semibold">
                                  {film.title}
                                </p>
                                {ratingLabel ? (
                                  <span className="rounded-full bg-white/90 px-2 py-1 text-[0.6rem] font-semibold text-black">
                                    {ratingLabel}
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
