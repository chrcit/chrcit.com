# chrcit.com — DITHER (Concept C: Mosaic)

Astro + MDX personal site. Visual source of truth:
`docs/redesign/explorations/concept-c.html`. Tokens, tile geometry, and
interactions are locked (see `docs/redesign/03-essence-and-vibe.md`).

## Commands

```bash
pnpm install
pnpm dev      # develop
pnpm build    # static build to dist/
pnpm preview  # serve the build
```

Cloudflare Workers: build `pnpm build`, then `npx wrangler versions upload`. Config is `wrangler.jsonc` (assets from `./dist`).

## Content

- `src/content/items/<category>/<slug>.md` — one generic item schema with a
  `category` flag (`book`, `tool`; extensible). Covers/icons are local assets
  next to the entries. Items render only where explicitly referenced or on
  their archive page — nothing autoloads.
- `src/content/posts/*.mdx` — writing.
- Reference an item inside any MDX post:

```mdx
import Item from "../../components/Item.astro";

<Item ref="books/antifragile" />
<Item ref="tools/raycast" variant="row" />
```

The homepage Books/Tools tiles are build-time random samples (re-rolled per
build). To pin a pick instead, replace the `sample()` call in
`src/pages/index.astro` with authored `getEntry` lookups.
