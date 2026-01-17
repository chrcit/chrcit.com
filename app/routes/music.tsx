import { useDeferredValue, useMemo, useState } from "react";
import { Play, Search, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { Route } from "./+types/music";
import { PageIntro } from "~/components/PageIntro";
import { useMusicPlayer } from "~/components/music/MusicPlayerProvider";
import musicData from "~/data/music.json";

const tileStyles: Record<string, string> = {
  classic: "aspect-[1/1]",
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
};

type MusicTrack = (typeof musicData)[number];

type GroupMode = "none" | "genre" | "artist";

type TrackGroup = {
  label: string;
  items: MusicTrack[];
};

export function meta() {
  return [
    { title: "Music · Christian Cito" },
    {
      name: "description",
      content:
        "A Spotify-backed listening room with preview snippets, art-forward covers, and a Pinterest-style layout.",
    },
  ];
}

export async function loader(_args: Route.LoaderArgs) {
  return { tracks: musicData as MusicTrack[] };
}

function getSpotifyUrl(track: MusicTrack) {
  return (
    track.spotifyUrl ||
    (track.spotifyId
      ? `https://open.spotify.com/track/${track.spotifyId}`
      : "")
  );
}

function trackMatches(track: MusicTrack, query: string) {
  if (!query) return true;
  const base = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
  return base.includes(query.toLowerCase());
}

function buildGroups(items: MusicTrack[], groupBy: GroupMode): TrackGroup[] {
  if (groupBy === "none") {
    return [{ label: "All tracks", items }];
  }

  const map = new Map<string, MusicTrack[]>();

  for (const track of items) {
    const key =
      groupBy === "artist"
        ? track.artist
        : track.genres?.[0] ?? "Other";
    const bucket = map.get(key) ?? [];
    bucket.push(track);
    map.set(key, bucket);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, groupItems]) => ({
      label,
      items: groupItems.sort((a, b) => a.title.localeCompare(b.title)),
    }));
}

export default function Music({ loaderData }: Route.ComponentProps) {
  const [groupBy, setGroupBy] = useState<GroupMode>("none");
  const [genreFilter, setGenreFilter] = useState("All");
  const [query, setQuery] = useState("");
  const { playTrack, currentTrack, isPlaying, openMini, showMini } =
    useMusicPlayer();
  const deferredQuery = useDeferredValue(query);

  const { tracks } = loaderData;

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const track of tracks) {
      track.genres?.forEach((genre) => set.add(genre));
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const genreMatch =
        genreFilter === "All" ||
        (track.genres ?? []).includes(genreFilter);
      return genreMatch && trackMatches(track, deferredQuery);
    });
  }, [tracks, genreFilter, deferredQuery]);

  const groups = useMemo(
    () => buildGroups(filteredTracks, groupBy),
    [filteredTracks, groupBy],
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Listening Room",
    numTracks: tracks.length,
    track: tracks.map((track) => ({
      "@type": "MusicRecording",
      name: track.title,
      byArtist: {
        "@type": "MusicGroup",
        name: track.artist,
      },
      inAlbum: {
        "@type": "MusicAlbum",
        name: track.album,
      },
      url: getSpotifyUrl(track) || undefined,
      image: track.coverUrl || undefined,
    })),
  };

  return (
    <div className="flex h-full flex-col gap-10">
      <PageIntro
        eyebrow="Listening room"
        title="Music"
        description="A Spotify-backed wall of album art. Tap any cover to summon the player, then keep browsing in full-screen mode."
      />

      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Grouping
            </p>
            <div className="flex flex-wrap gap-2">
              {([
                { value: "none", label: "Nothing" },
                { value: "genre", label: "Genre" },
                { value: "artist", label: "Artist" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGroupBy(option.value)}
                  className={clsx(
                    "pressable rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.28em] transition",
                    groupBy === option.value
                      ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)]/15 text-white"
                      : "border-white/10 text-white/60 hover:border-white/40 hover:text-white",
                  )}
                  aria-pressed={groupBy === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative">
              <span className="sr-only">Search tracks</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tracks, artists, albums"
                className="w-full rounded-full border border-white/10 bg-black/40 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[color:var(--color-brand)]"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setGenreFilter(genre)}
                  className={clsx(
                    "pressable rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] transition",
                    genreFilter === genre
                      ? "border-white/60 bg-white/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/40 hover:text-white",
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          {currentTrack && !showMini ? (
            <button
              type="button"
              onClick={openMini}
              className="pressable flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/60 transition hover:border-white/40 hover:text-white"
            >
              <Play size={14} />
              Open player
            </button>
          ) : null}
        </div>

        <div className="space-y-12">
          {groups.map((group, groupIndex) => (
            <section key={`${group.label}-${groupIndex}`} className="space-y-6">
              {groupBy !== "none" ? (
                <div className="flex items-center justify-between">
                  <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[color:var(--color-ink)]">
                    {group.label}
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {group.items.length} tracks
                  </span>
                </div>
              ) : null}
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {group.items.map((track, index) => {
                  const active = track.id === currentTrack?.id;
                  const tileClass =
                    tileStyles[track.tile ?? "classic"] ?? tileStyles.classic;
                  const delay = `${(index % 6) * 70}ms`;
                  const hasPreview = Boolean(track.previewUrl);
                  return (
                    <article
                      key={track.id}
                      className="music-tile mb-6 break-inside-avoid"
                    >
                      <button
                        type="button"
                        onClick={() => (hasPreview ? playTrack(track) : null)}
                        className={clsx(
                          "group w-full text-left",
                          hasPreview ? "cursor-pointer" : "cursor-default",
                        )}
                        aria-pressed={active}
                      >
                        <div
                          className={clsx(
                            "reveal relative overflow-hidden rounded-[1.6rem] border bg-white/5 transition",
                            active
                              ? "border-[color:var(--color-brand)]/60 shadow-[0_20px_60px_-40px_rgba(255,255,255,0.35)]"
                              : "border-white/10 hover:border-white/40",
                            tileClass,
                          )}
                          data-noise
                          style={{ animationDelay: delay }}
                        >
                          {track.coverUrl ? (
                            <img
                              src={track.coverUrl}
                              alt={`${track.album} cover`}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              fetchPriority="low"
                            />
                          ) : (
                            <div
                              className="flex h-full w-full flex-col justify-between p-4 text-white"
                              style={{
                                backgroundImage: track.palette
                                  ? `linear-gradient(140deg, ${track.palette[0]}, ${track.palette[1]})`
                                  : "linear-gradient(140deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                              }}
                            >
                              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/70">
                                {track.album}
                              </span>
                              <span className="text-lg font-semibold leading-tight">
                                {track.title}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute inset-0 flex items-end justify-between p-4">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                                {track.genres?.[0] ?? ""}
                              </p>
                              {track.year ? (
                                <p className="text-xs text-white/50">
                                  {track.year}
                                </p>
                              ) : null}
                            </div>
                            <span
                              className={clsx(
                                "flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em]",
                                hasPreview
                                  ? active
                                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)]/20 text-white"
                                    : "border-white/30 bg-black/60 text-white/80"
                                  : "border-white/10 bg-black/40 text-white/40",
                              )}
                            >
                              <Play size={12} />
                              {hasPreview
                                ? active && isPlaying
                                  ? "Playing"
                                  : "Play"
                                : "No preview"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-semibold text-[color:var(--color-ink)]">
                            {track.title}
                          </p>
                          <p className="text-xs text-white/60">
                            {track.artist}
                          </p>
                        </div>
                      </button>

                      {getSpotifyUrl(track) ? (
                        <a
                          href={getSpotifyUrl(track)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50 transition hover:text-white"
                        >
                          <Sparkles size={12} />
                          Open in Spotify
                        </a>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {filteredTracks.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              No tracks match that filter yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
