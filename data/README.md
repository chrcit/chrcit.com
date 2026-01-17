Media data seeds

The seed files in this folder are the starting point for the media fetch scripts.
Add your favorites (Spotify track URLs, IMDb IDs, RAWG slugs) and run the
scripts to regenerate the JSON used by the app.

Seed files
- data/games.seed.json

Commands
- node scripts/fetch-rawg.mjs

Environment
- RAWG_API_KEY (required for RAWG)

Notes
- RAWG requires attribution; the /games page includes a source link.
- RAWG profile scraping: set `profileUrl` in data/games.seed.json and optional `profileSections`
  (`owned`, `toplay`, `playing`, `beaten`, `dropped`, `yet`) to auto-seed your list.
