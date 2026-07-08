# AGENTS.md

Use Bun only for package and project commands in this repo.

- Use `bun install` for dependencies.
- Use `bunx <tool>` for local CLI tools.
- Do not use `npm`, `npx`, `pnpm`, or `yarn`.

## Folder structure

- `src/domain`: business objects, domain terms, and domain rules.
- `src/backend`: server entrypoints, routes, request handling, and framework
  integration that is specific to the backend app.
- `src/lib`: small local wrappers around third-party libraries and other
  non-domain shared code, such as the typed Hono factory.
- `src/db`: database schemas, config, factories, migrations helpers, and
  database-specific utilities.
- `src/infra`: infrastructure-as-code and operational tasks.
- `src/ui`: React Router UI code, routes, styles, and server rendering entry
  points.

## Commit messages

Use a relevant emoji prefix for commit messages. Pick an emoji that matches the
actual change description and avoid `:sparkles:`. Prefer emojis that are
distinct from recent git history when there is a good contextual match, but
reusing an emoji is fine when it is still the clearest fit.

Examples:

- `🏗️ Add Cloudflare infra scaffolding`
- `🗄️ Wire local D1 database helpers`
- `🐛 Fix wrangler preview database lookup`
- `📝 Document Bun-only project commands`

## Local development secrets

Use a single Doppler wrapper for the local dev command:

`doppler run -- bunx vite dev`

Doppler injects secrets into the process environment, and the Cloudflare Vite
plugin makes those bindings available to the Worker runtime. Do not mount or
generate `.dev.vars` for local development.

The `CLOUDFLARE_ENV` flag comes from Doppler. Keep it set to `dev` for the local
development project so the Cloudflare Vite plugin loads `env.dev` from
`wrangler.jsonc` when `bunx vite dev` runs.

## Local D1 preview database

Wrangler/Miniflare stores local D1 databases under:

`./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite`

The `<hash>` is not a plain hash of the database name. It is computed from the
local D1 database id using Miniflare's Durable Object namespace id algorithm:

- `uniqueKey = "miniflare-D1DatabaseObject"`
- `key = sha256(uniqueKey)`
- `nameHmac = hmacSha256(key, localD1DatabaseId).subarray(0, 16)`
- `hmac = hmacSha256(key, nameHmac).subarray(0, 16)`
- `<hash> = hex(nameHmac + hmac)`

In this repo, the local D1 database id should come from `wrangler.jsonc`, not
from a hardcoded string. For the master D1 database, read:

`env.dev.d1_databases[]` where `binding === "MASTER_D1"`

Then use `preview_database_id` as the local id. If that is absent, Wrangler
falls back to `database_id`, then the binding name. Keep the helper logic in
`src/db/util.ts`; `src/db/drizzle.master-d1.config.ts` reads `wrangler.jsonc`,
selects the `MASTER_D1` binding, and passes the local id to
`getLocalD1DatabasePath()`.

Treat the D1 binding name as the database id in application code and filenames.
Use kebab-case for database-specific Drizzle config and schema files. For
example, the `MASTER_D1` binding maps to the `master-d1` id, so its files should
be named like:

- `src/db/drizzle.master-d1.config.ts`
- `src/db/schema.master-d1.ts`

For future D1 databases, or other database types, follow the same pairing:
create a database-specific Drizzle config file and a matching schema file with
the same kebab-case database id in the filename.
