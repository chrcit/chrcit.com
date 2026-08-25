# Current state of chrcit.com

Two generations of the site live in this repo (branch `feature/art-419-refactor-to-remix`).

## Legacy site (`astro-legacy/`) — the previously shipped version

- Astro + Tailwind, light theme: white background, dark-red brand `#8B1717`.
- Fonts: Playfair Display (serif headings) + Schibsted Grotesk (body).
- Homepage: cut-out profile photo, interactive tsparticles network background, copy: "Hi, I'm Christian. **I create things for the internet.**" + links to year-in-review, projects, books.
- Content collections: articles, books (~27 with ratings), films, musicians, quotes, shows, projects, pages (colophon, uses, imprint, privacy).
- Vibe: friendly, personal, slightly academic (serif + white + wine red). A classic dev personal site.

## WIP rewrite (`app/`) — React Router 7 (Remix-style), unshipped

- Dark theme: near-black purple paper, warm off-white ink, hot red/pink brand (oklch), noise texture overlay, radial gradient washes.
- Fonts: Syne (display) + IBM Plex Sans (body) + IBM Plex Mono.
- Hero copy: "I create digital products with taste, pressure, and clarity." Sub: works end-to-end across product, engineering, design. Expandable cards for roles: Director at Arthouse, software at hausgemacht.
- Nav: Home / Projects / Articles / Books / Music / Films / Games.
- Notable features: persistent music player (Spotify-synced tracks, floating-note animation, glow), films/games/music data pipelines (`scripts/`), MDX content with GitHub-backed reader, consent-gated embeds.
- Footer: "Vienna · Remote" / "Calm systems, bold visuals, direct writing."
- Vibe as-built: moody, glowy, music-forward; more "producer/DJ portfolio" energy than the legacy site.

## Identity raw material

- Name: Christian Cito. Handle: chrcit. Email: citochris@gmail.com.
- Socials: GitHub, Instagram, LinkedIn, X/Twitter, Twitch, YouTube (all @chrcit).
- Self-descriptions found in code: "product engineer + designer", "digital product work with a human edge", "10+ years on the web" (legacy said 11 years as of ~2023), "taste, pressure, and clarity", "calm systems, bold visuals, direct writing".
- Roles: Director at Arthouse (creative engineering studio), software/systems at hausgemacht (feminist techno collective), co-organizer of rebased.wtf ("chief vibe officer").
- Strong media/taste dimension: curated books, films, music, games — the site is part portfolio, part taste archive.
