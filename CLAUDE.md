# Claude context

Follow `AGENTS.md` as the canonical implementation guide. Product intent lives in `base-context.md`, technical boundaries in `architecture.md`, and the current visual direction in `design.md`.

Useful commands:

```sh
pnpm dev
pnpm sanity:types
pnpm sanity:import:dry
pnpm sanity:import
pnpm sanity:readwise:dry
pnpm sanity:readwise
pnpm check
pnpm typecheck
pnpm build
pnpm test:smoke
```

Do not deploy this branch unless Christian explicitly requests it. Do not replace referenced library content with copied page content.

Readwise highlights are modeled as first-class `quote` documents that reference one book or article `thing`. The live archive can be mirrored through the configured Readwise and Sanity MCPs; the command-line sync remains available for explicit API-token or export-based maintenance.
