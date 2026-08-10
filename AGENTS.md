# chrcit.com agent guide

This repository is the clean Sanity-backed rebuild of Christian Cito's personal site. Treat it as an editorial system, not a conventional portfolio template or an automatically generated content directory.

## Product rules

- The homepage is a hand-authored singleton assembled from Sanity blocks.
- Pages should feel editorial. A page decides which library records to expose and in what order.
- `thing` is the reusable library record for books, articles, films, music, albums, tools, games, websites, and uncategorized references. Things do not get public detail routes by default.
- `project` and `article` may have detail routes. Historic projects stay in Sanity but must not become an automatic project index.
- Do not add About, Writing, Things, or Projects overview routes. The homepage is the index; `/books` is the single intentional collection page.
- Keep the header to a linked `chrcit.com` root and contextual, unlinked breadcrumbs.
- Prefer references over duplicated content. A record should exist once and be sampled into multiple pages.
- Legal, contact, imprint, privacy, navigation, SEO, theme, and newsletter copy belong in Sanity.
- Do not deploy or change Cloudflare production configuration until Christian explicitly asks. The Worker setup is intentionally deployment-ready for later.

## Implementation rules

- Use `pnpm`; Node 22.22 or newer is required.
- React Router owns the web app and `/studio` embeds Sanity Studio.
- After changing schemas or GROQ, run `pnpm sanity:types` and use the generated types from `@gen/sanity`.
- Keep preview mode and Visual Editing working for every Sanity-backed public route.
- Keep `scripts/import-legacy-content.ts` idempotent. Its stable document IDs make it safe to rerun against the empty project.
- Never commit tokens. `MAILERLITE_API_TOKEN`, Sanity read tokens, and the session secret are runtime secrets.
- New page-builder blocks need four parts: schema, GROQ projection, typed renderer, and a useful Studio preview.
- Render explicit loading, success, empty, and error states for network-backed UI.
- Preserve visible focus states, keyboard operation, semantic headings, meaningful image alt text, and reduced-motion preferences.
- Run `pnpm check`, `pnpm typecheck`, `pnpm build`, and `pnpm test:smoke` before handing over material changes.

## Visual guardrails

- Use Geologica as the only font until the licensed ABC Dynamo Whyte Inktrap assets are intentionally restored.
- Keep the system compact, technical, and artsy: strong type, hairline rules, one warm accent, generous but purposeful whitespace.
- Avoid generic dashboard cards, excessive rounded containers, decorative gradients, floating pills, and motion without a product reason.
- The core pages must work in both light and dark system modes. Sanity theme values can override the defaults.

Read `base-context.md`, `architecture.md`, and `design.md` before changing product structure or visual direction.
