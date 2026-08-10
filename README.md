# chrcit.com

Clean React Router and Sanity rebuild of chrcit.com, initialized from the current Arthouse Sanity starter.

## Local setup

```sh
cp .env.example .env
cp .dev.vars.example .dev.vars
pnpm install
pnpm dev
```

The site and embedded Studio run at `http://localhost:5173` and `http://localhost:5173/studio`. Sanity project `pqdr91mr` uses the public `production` dataset.

## Import the old site

The migration reads content and assets from `origin/main`, converts them to the new model, and uses stable IDs:

```sh
pnpm sanity:import:dry
pnpm sanity:import
```

The import is safe to rerun: stable IDs and `createIfNotExists` keep later Studio edits and Readwise metadata intact. It is a baseline import, not a mechanism for overwriting editorial work.

## Newsletter

Set `MAILERLITE_API_TOKEN` as a server/Worker secret and set the default MailerLite group ID in Studio under Site settings → MailerLite. A newsletter block may override that group.

## Readwise

Reading sources are stored once as `thing` documents. Each Readwise highlight is a separately referenceable `quote` linked to its source, so it can be selected in rich text, page blocks, and filtered collections without copying the passage.

The live archive is mirrored directly from the authenticated Readwise MCP into the Sanity dataset through Sanity MCP. For later offline maintenance, the repository also includes an idempotent token/export sync:

```sh
pnpm sanity:readwise:dry
pnpm sanity:readwise
```

The fallback command accepts the Readwise API token from the environment or an archive placed under `imports/`; neither credential nor archive is committed.

## Verification

```sh
pnpm check
pnpm typecheck
pnpm build
pnpm test:smoke
```

Cloudflare configuration is present for a later push-deploy task. Do not run `pnpm deploy` until the production Worker, domains, secrets, and CI policy have been agreed.
