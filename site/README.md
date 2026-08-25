# chrcit.com — DITHER (Concept C: Mosaic)

Astro + MDX implementation of the redesign. The visual source of truth is
`../docs/redesign/explorations/concept-c.html` — tokens, tile geometry, and
interactions are locked (see `../docs/redesign/03-essence-and-vibe.md`).

## Commands

```bash
npm install
npm run dev      # develop
npm run build    # static build to dist/
npm run preview  # serve the build
```

## Content

- `src/content/items/<category>/<slug>.md` — one generic item schema with a
  `category` flag (`book`, `tool`; extensible). Covers/icons are local assets
  next to the entries. Items render only where explicitly referenced or on
  their archive page — nothing autoloads.
- `src/content/posts/*.mdx` — writing. Monthly "Notes № N" (`kind: notes`) and
  one year-in-review per year (`kind: annual`).
- Reference an item inside any MDX post:

```mdx
import Item from "../../components/Item.astro";

<Item ref="books/antifragile" />
<Item ref="tools/raycast" variant="row" />
```

The homepage Books/Tools tiles are build-time random samples (re-rolled per
build). To pin a pick instead, replace the `sample()` call in
`src/pages/index.astro` with authored `getEntry` lookups.

## Migration

`../scripts/migrate-books-to-items.mjs` and `../scripts/migrate-tools-to-items.mjs`
are the one-off scripts that moved the legacy content over (run from repo root).
