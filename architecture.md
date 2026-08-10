# Architecture

## Runtime

```text
Sanity production dataset (pqdr91mr)
        │ published GROQ + previewDrafts
        ▼
React Router 8 app and Sanity Visual Editing
        │
        ├── public routes: /, /reading, legal pages, /projects/:slug, /writing/:slug
        ├── embedded Studio: /studio/*
        ├── newsletter action: /api/newsletter → MailerLite
        └── Cloudflare Worker adapter (deployment intentionally deferred)
```

The public dataset is queried through the Sanity CDN for published requests. Preview mode uses a server-side read token, `previewDrafts`, stega encoding, and the embedded Presentation tool.

## Content model

- `page`: editorial pages and the `homepage` singleton. Pages choose rich text or an ordered array of blocks and can enable a generated table of contents.
- `thing`: one reusable record for anything Christian likes or uses. Its `kind` distinguishes books, articles, films, music, albums, tools, games, websites, and other items.
- `quote`: an independently referenceable passage linked to one reading `thing`. Manual quotes and Readwise highlights share the same public model; integration metadata is isolated from editorial commentary.
- `project`: a detailed project story with a public detail route. `historical` prevents old work from silently appearing in current-work filters.
- `article`: authored long-form writing with a public detail route or optional external canonical URL.
- `topic`: shared taxonomy referenced by things, projects, and articles.
- `siteSettings`, `themeSettings`, `header`, `footer`: fixed-ID singleton documents.

Page blocks are `heroBlock`, `richTextBlock`, `referenceCollection`, `quoteBlock`, `newsletterBlock`, `linkListBlock`, `complexImage`, and `separator`. `referenceCollection` and `quoteBlock` are also available inside Portable Text. A `quoteBlock` references a canonical quote and stores only placement-specific context.

The public header is intentionally not a section navigation. It renders one linked `chrcit.com` root followed by unlinked route breadcrumbs. About, Writing, Things, and Projects overview routes do not exist; discovery starts on the homepage. Reading is the one curated library view.

## Readwise boundary

The live archive is mirrored from the authenticated Readwise MCP directly into Sanity through Sanity MCP. It matches entities by explicit source identity and writes only integration-owned fields. Personal commentary, topics, featured state, and page placement remain editorial. `scripts/sync-readwise.ts` provides the same contract for later API-token or export-based maintenance without inventing dynamic document types.

## Reference resolution

A page query returns its ordered blocks plus the public thing, project, and article library. Manual collections and quote blocks are dereferenced directly from the page. Readwise quotes are not added to the global library payload; a page receives only quotes it explicitly references. Quote renderers require an explicit placement context: a page reference is always editorially valid, a connected-book placement requires a referenced `thing` with `kind == "book"`, and a book-page placement must match that exact book ID. This prevents orphaned or unrelated highlights from leaking into general views. Filtered collections resolve client-side by document type, thing kind, topic, featured state, historic state, sort order, and limit.

## Newsletter

The browser posts an email and optional block-specific group ID to `/api/newsletter`. The server falls back to `siteSettings.newsletter.groupId`, reads `MAILERLITE_API_TOKEN` only at runtime, and calls MailerLite's subscriber endpoint. The token is never sent to the browser.

## Import

`scripts/import-legacy-content.ts` reads `origin/main` directly with Git, so the old Astro tree does not need to exist in this branch. It parses frontmatter, converts Markdown/cleaned MDX to Portable Text, uploads referenced images, imports historic records with stable IDs, and seeds the singletons and initial editorial pages. `createIfNotExists` makes reruns safe after Studio edits and Readwise enrichment.

## Cloudflare

`wrangler.jsonc`, the Worker entry point, React Router server build, environment typing, and deployment script come from the current Arthouse Sanity starter. Production deployment, domains, secrets, and CI push-deploy remain intentionally unconfigured until the follow-up deployment task.
