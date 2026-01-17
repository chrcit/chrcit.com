import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/games";
import gamesData from "~/data/games.json";

const groupOptions = [
  { value: "none", label: "None" },
  { value: "genre", label: "Genre" },
  { value: "studio", label: "Studio" },
] as const;

const filterOptions = [
  { value: "all", label: "All" },
  { value: "top", label: "Top rated" },
  { value: "recent", label: "Recent" },
] as const;

type Game = {
  id: number | string;
  slug?: string | null;
  title: string;
  released?: string | null;
  backgroundImage?: string | null;
  description?: string | null;
  genres?: string[] | null;
  developers?: string[] | null;
  platforms?: string[] | null;
  rating?: number | null;
  metacritic?: number | null;
  website?: string | null;
  rawgUrl?: string | null;
  featured?: boolean | null;
};

type GroupBy = (typeof groupOptions)[number]["value"];
type FilterBy = (typeof filterOptions)[number]["value"];

export function meta() {
  return [
    { title: "Games · Christian Cito" },
    {
      name: "description",
      content: "Favorite games, studios, and playable worlds.",
    },
  ];
}

export async function loader() {
  return { games: gamesData as Game[] };
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getPrimaryStudio(game: Game) {
  return game.developers?.[0] ?? "Unknown studio";
}

function getPrimaryGenre(game: Game) {
  return game.genres?.[0] ?? "Other";
}

function getGroupKey(game: Game, groupBy: GroupBy) {
  if (groupBy === "genre") return getPrimaryGenre(game);
  if (groupBy === "studio") return getPrimaryStudio(game);
  return "";
}

export default function Games({ loaderData }: Route.ComponentProps) {
  const games = loaderData.games ?? [];
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [query, setQuery] = useState("");
  const [flowOpen, setFlowOpen] = useState(false);
  const [flowIndex, setFlowIndex] = useState(0);
  const [barCollapsed, setBarCollapsed] = useState(false);
  const flowRef = useRef<HTMLDivElement | null>(null);

  const filteredGames = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    const currentYear = new Date().getFullYear();

    return games.filter((game) => {
      if (filterBy === "top" && (game.rating ?? 0) < 4) return false;
      if (filterBy === "recent") {
        const year = game.released ? Number(game.released.slice(0, 4)) : 0;
        if (year < currentYear - 4) return false;
      }

      if (!normalizedQuery) return true;

      const haystack = [
        game.title,
        getPrimaryStudio(game),
        game.genres?.join(" "),
        game.platforms?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [games, filterBy, query]);

  const orderedGames = useMemo(() => {
    const items = [...filteredGames];
    if (groupBy === "none") return items;
    return items.sort((a, b) => {
      const groupA = getGroupKey(a, groupBy).toLowerCase();
      const groupB = getGroupKey(b, groupBy).toLowerCase();
      if (groupA === groupB) return a.title.localeCompare(b.title);
      return groupA.localeCompare(groupB);
    });
  }, [filteredGames, groupBy]);

  const flowGames = orderedGames;
  const safeFlowIndex = Math.min(
    flowIndex,
    Math.max(flowGames.length - 1, 0),
  );
  const activeGame = flowGames[safeFlowIndex];

  const scrollToIndex = (index: number) => {
    const container = flowRef.current;
    if (!container) return;
    const slide = container.querySelector<HTMLDivElement>(
      `[data-flow-index="${index}"]`,
    );
    slide?.scrollIntoView({ behavior: "smooth", inline: "start" });
  };

  const clampIndex = (index: number) =>
    Math.max(0, Math.min(index, Math.max(flowGames.length - 1, 0)));

  const goToIndex = (index: number) => {
    const nextIndex = clampIndex(index);
    setFlowIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    goToIndex(safeFlowIndex - 1);
  };

  const handleNext = () => {
    goToIndex(safeFlowIndex + 1);
  };

  const openFlow = (game: Game) => {
    const index = flowGames.findIndex((item) => item.id === game.id);
    const nextIndex = index >= 0 ? index : 0;
    setFlowIndex(nextIndex);
    setFlowOpen(true);
    setBarCollapsed(false);
    setTimeout(() => scrollToIndex(nextIndex), 0);
  };

  useEffect(() => {
    if (!flowOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [flowOpen]);

  return (
    <div className="relative flex h-[calc(100dvh-9rem)] flex-col overflow-hidden">
      <header className="flex h-20 items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-black/55 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="font-[var(--font-display)] text-xl font-semibold text-[color:var(--color-ink)]">
            Games
          </h1>
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">
            {orderedGames.length} titles
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <select
            aria-label="Group games"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupBy)}
            className="h-8 rounded-full border border-white/10 bg-black/50 px-3 text-[10px] uppercase tracking-[0.3em] text-white/70"
          >
            {groupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Group: {option.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter games"
            value={filterBy}
            onChange={(event) => setFilterBy(event.target.value as FilterBy)}
            className="h-8 rounded-full border border-white/10 bg-black/50 px-3 text-[10px] uppercase tracking-[0.3em] text-white/70"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-8 w-32 rounded-full border border-white/10 bg-black/40 px-3 text-xs text-white/80 placeholder:text-white/40 md:w-48"
          />
          <a
            href="https://rawg.io"
            target="_blank"
            rel="noreferrer"
            className="hidden text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/70 md:inline"
          >
            RAWG
          </a>
        </div>
      </header>

      <div
        className={[
          "scroll-minimal flex-1 px-1 py-6",
          flowOpen ? "overflow-y-hidden" : "overflow-y-auto",
        ].join(" ")}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {orderedGames.length
            ? orderedGames.map((game) => (
                <article key={game.id} className="group">
                  <button
                    type="button"
                    onClick={() => openFlow(game)}
                    className="flex w-full flex-col gap-3 text-left"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/50 shadow-[0_25px_60px_-45px_rgba(0,0,0,0.9)]">
                      {game.backgroundImage ? (
                        <img
                          src={game.backgroundImage}
                          alt={game.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-black/40 text-xs uppercase tracking-[0.3em] text-white/60">
                          Cover coming
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/70">
                        <span>{getPrimaryGenre(game)}</span>
                        <span>{game.released?.slice(0, 4) ?? ""}</span>
                      </div>
                    </div>
                    <div className="space-y-1 px-1">
                      <p className="text-sm font-semibold text-[color:var(--color-ink)]">
                        {game.title}
                      </p>
                      <p className="text-xs text-white/60">
                        {getPrimaryStudio(game)}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                        Open in RAWG ↗
                      </p>
                    </div>
                  </button>
                </article>
              ))
            : Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="space-y-3 rounded-[1.8rem] border border-white/10 bg-white/5 p-4"
                  aria-hidden
                >
                  <div className="aspect-square rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/40" />
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/5" />
                  </div>
                </div>
              ))}
        </div>
      </div>

      {flowOpen ? (
        <section className="fixed inset-x-0 top-20 bottom-0 z-40 flex flex-col overflow-hidden border-t border-white/10 bg-black">
          <div className="pointer-events-none absolute inset-0">
            {activeGame?.backgroundImage ? (
              <>
                <div
                  className="absolute inset-0 scale-110 bg-center bg-cover blur-[60px] brightness-75 saturate-125"
                  style={{ backgroundImage: `url(${activeGame.backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black/95" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              ref={flowRef}
              onScroll={(event) => {
                const target = event.currentTarget;
                const width = target.clientWidth || 1;
                const nextIndex = Math.round(target.scrollLeft / width);
                if (nextIndex !== flowIndex) setFlowIndex(nextIndex);
              }}
              className="scroll-minimal relative z-10 flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
            >
              {flowGames.map((game, index) => (
                <article
                  key={game.id}
                  data-flow-index={index}
                  className="scroll-minimal h-full w-full shrink-0 snap-start overflow-y-auto"
                >
                  <div className="flex min-h-full flex-col gap-6 px-6 py-8 lg:flex-row lg:gap-10">
                    <div className="self-start lg:sticky lg:top-6">
                      <div className="relative aspect-[3/4] w-60 overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/5 shadow-[var(--shadow-soft)] sm:w-72 lg:w-80">
                        {game.backgroundImage ? (
                          <img
                            src={game.backgroundImage}
                            alt={game.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-black/40 text-xs uppercase tracking-[0.3em] text-white/60">
                            Cover
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-6 pb-10">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                          {getPrimaryStudio(game)}
                        </p>
                        <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[color:var(--color-ink)]">
                          {game.title}
                        </h2>
                        <p className="text-sm text-white/60">
                          Released {game.released ?? "—"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(game.genres ?? []).map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/70"
                          >
                            {genre}
                          </span>
                        ))}
                        {(game.platforms ?? []).map((platform) => (
                          <span
                            key={platform}
                            className="rounded-full border border-white/5 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>

                      {game.description ? (
                        <p className="max-w-prose text-sm leading-relaxed text-white/70">
                          {game.description}
                        </p>
                      ) : null}

                      <div className="grid gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                            Rating
                          </span>
                          <span>{game.rating?.toFixed(1) ?? "—"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                            Metacritic
                          </span>
                          <span>{game.metacritic ?? "—"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                            Studio
                          </span>
                          <span>{getPrimaryStudio(game)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {game.website ? (
                          <a
                            href={game.website}
                            target="_blank"
                            rel="noreferrer"
                            className="pressable rounded-full border border-[color:var(--color-brand)] bg-[color:var(--color-brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-[var(--shadow-glow)]"
                          >
                            Official site
                          </a>
                        ) : null}
                        {game.rawgUrl ? (
                          <a
                            href={game.rawgUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="pressable rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/30 hover:text-white"
                          >
                            RAWG
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            className={[
              "relative z-10 flex flex-col border-t border-white/10 bg-black/70",
              barCollapsed ? "h-16" : "h-[30vh] min-h-[180px]",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
              <div
                className={[
                  "space-y-1",
                  barCollapsed ? "hidden sm:block" : "",
                ].join(" ")}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Now viewing
                </p>
                <p className="text-sm font-semibold text-[color:var(--color-ink)]">
                  {activeGame?.title ?? "Select a game"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="pressable rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/30 hover:text-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="pressable rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/30 hover:text-white"
                >
                  →
                </button>
                {activeGame?.rawgUrl ? (
                  <a
                    href={activeGame.rawgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex pressable rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/30 hover:text-white"
                  >
                    RAWG
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => setFlowOpen(false)}
                  className={[
                    "pressable rounded-full border border-[color:var(--color-brand)] bg-[color:var(--color-brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-[var(--shadow-glow)]",
                    barCollapsed ? "hidden sm:inline-flex" : "",
                  ].join(" ")}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setBarCollapsed((value) => !value)}
                  className="pressable rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/30 hover:text-white sm:hidden"
                >
                  {barCollapsed ? "⌃" : "⌄"}
                </button>
              </div>
            </div>
            {!barCollapsed ? (
              <div className="scroll-minimal flex-1 snap-x snap-mandatory overflow-x-auto px-6 pb-4">
                <div className="flex h-full items-center gap-4">
                  {flowGames.map((game, index) => (
                    <button
                      key={`${game.id}-thumb`}
                      type="button"
                      onClick={() => {
                        goToIndex(index);
                      }}
                      className={
                        index === safeFlowIndex
                          ? "relative flex h-full w-36 shrink-0 snap-start overflow-hidden rounded-[1rem] border border-white/40"
                          : "relative flex h-full w-36 shrink-0 snap-start overflow-hidden rounded-[1rem] border border-white/10 opacity-70 hover:opacity-100"
                      }
                    >
                      {game.backgroundImage ? (
                        <img
                          src={game.backgroundImage}
                          alt={game.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-black/40 text-[10px] uppercase tracking-[0.3em] text-white/60">
                          {game.title}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
