import { useRef } from "react";
import { Link, NavLink } from "react-router";
import { AudioLines } from "lucide-react";
import { ScrollProgress } from "~/components/layout/ScrollProgress";
import { SocialLinks } from "~/components/SocialLinks";
import { useMusicPlayer } from "~/components/music/MusicPlayerProvider";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Articles", to: "/articles" },
  { label: "Books", to: "/books" },
  { label: "Music", to: "/music" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { currentTrack, isPlaying, openMini, showMini, showFull } =
    useMusicPlayer();

  return (
    <div className="relative z-10 flex h-[100dvh] flex-col">
      <ScrollProgress containerRef={scrollRef} />
      <header className="z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-white/10">
              <img
                alt="Christian Cito"
                src="/images/cut-out.png"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">
                Christian Cito
              </p>
              <p className="text-sm text-white/70">
                Digital product work with a human edge.
              </p>
            </div>
          </Link>

          <nav className="flex max-w-full items-center gap-6 overflow-x-auto pb-1 pt-1 text-xs uppercase tracking-[0.28em] text-white/60">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "pressable whitespace-nowrap border-b-2 pb-2 transition",
                    isActive
                      ? "border-[color:var(--color-brand)] text-white"
                      : "border-transparent hover:border-white/30 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {currentTrack && !showMini && !showFull ? (
              <button
                type="button"
                onClick={openMini}
                className="pressable flex w-[150px] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-[0.6rem] uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <AudioLines size={14} className="text-white/60" />
                <span className="flex-1 truncate">
                  {currentTrack.title}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPlaying
                      ? "bg-[color:var(--color-brand)] shadow-[0_0_12px_rgba(255,120,80,0.7)]"
                      : "bg-white/20"
                  }`}
                />
              </button>
            ) : null}
            <a
              href="mailto:citochris@gmail.com"
              className="pressable text-xs uppercase tracking-[0.28em] text-white/70 hover:text-white"
            >
              Contact ↗
            </a>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <main className="mx-auto w-full max-w-6xl px-5 py-8 pb-[calc(var(--player-offset)+2rem)]">
          {children}
        </main>

        <footer className="border-t border-white/10 bg-black/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Vienna · Remote
              </p>
              <p className="text-sm text-white/65">
                Calm systems, bold visuals, direct writing.
              </p>
            </div>
            <SocialLinks className="justify-start md:justify-end" />
          </div>
        </footer>
      </div>
    </div>
  );
}
