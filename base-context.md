# Base context

## Goal

Rebuild chrcit.com as a clean, Sanity-backed personal publishing system. The homepage is the main overview: a linked biography connecting Arthouse, hausgemacht, rebased.wtf, the 2023 year in review, reading, external destinations, and a newsletter. It must not read as a comprehensive portfolio or an automatically generated directory.

## Editorial premise

Christian is less interested in showcasing every project and more interested in publishing selected context: substantial writing, current work, curious side experiments, and a reusable database of references. Historic projects remain available but should feel archival. Reading combines books and articles with separately referenceable quotes. Films, music, albums, tools, games, and websites remain available in the broader library.

The database is raw material. Pages are editorial decisions. A thing can be referenced from the homepage, a prose article, a carousel, a grid, or a filtered list without being duplicated.

## Initial information architecture

- Home: current bio, Arthouse/Creative Cluster, hausgemacht, and rebased links in prose, the 2023 year in review, reading, external links, and newsletter.
- Reading: an editorial `/reading` page with a generated table of contents, clickable book/article cards, and reusable quotes linked to their sources.
- One article at `/writing/2023-year-in-review`, with its linked project stories beneath the same direct hierarchy.
- Selected project detail routes; no projects overview.
- No About, Writing, or Things overview pages.
- Imprint, privacy, colophon, and uses remain Sanity pages.
- Studio at `/studio`.

## Imported baseline

The import reads the current `main` branch and carries forward the 2023 year-in-review article, four project stories and their media, the book library and covers, the film/show/music records, the legacy quote, legal pages, colophon, and uses. Project records default to historical. The initial homepage intentionally selects only a small number of these records.

## Deferred decisions

- Final identity and restoration of licensed ABC Dynamo Whyte Inktrap.
- Final edits to the seeded homepage biography.
- MailerLite API token and destination group ID.
- Final analytics choice and consent language.
- Cloudflare domain, secrets, CI, and push-deploy configuration.
- Whether selected things eventually receive public detail pages.
