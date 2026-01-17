import { Link, NavLink, useLocation } from "react-router";
import { ScrollProgress } from "~/components/layout/ScrollProgress";
import { SocialLinks } from "~/components/SocialLinks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Articles", to: "/articles" },
  { label: "Books", to: "/books" },
  { label: "Films", to: "/films" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isFilmsRoute = location.pathname.startsWith("/films");

  return (
    <div className="relative z-10 min-h-screen">
      <ScrollProgress />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur">
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

          <a
            href="mailto:citochris@gmail.com"
            className="pressable text-xs uppercase tracking-[0.28em] text-white/70 hover:text-white"
          >
            Contact ↗
          </a>
        </div>
      </header>

      <main
        className={
          isFilmsRoute
            ? "w-full px-3 py-4"
            : "mx-auto w-full max-w-6xl px-5 py-8"
        }
      >
        {children}
      </main>

      {!isFilmsRoute && (
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
      )}
    </div>
  );
}
