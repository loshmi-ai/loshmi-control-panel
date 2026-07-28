# AGENTS.md

Use Bun only for package and project commands in this repo.

- Use `bun install` for dependencies.
- Use `bunx <tool>` for local CLI tools.
- Do not use `npm`, `npx`, `pnpm`, or `yarn`.

## Folder structure

- `src/domain`: business objects, domain terms, and domain rules.
- `src/api`: Worker entrypoints, API routes, request handling, and framework
  integration for everything served by the app, including UI rendering.
- `src/db`: database schemas, config, factories, migrations helpers, and
  database-specific utilities.
- `src/infra`: infrastructure-as-code and operational tasks.
- `src/ui`: React Router UI code, routes, styles, and server rendering entry
  points.

Use local `lib` folders for helpers that belong to one app surface:

- `src/api/lib`: API/runtime helpers, such as the typed Hono factory and
  React Router context produced by API route handlers.
- `src/ui/lib`: UI helpers, such as client auth.

When a helper is shared between API and UI, place it with the side that owns the
value or lifecycle. For example, React Router context is consumed by UI route
loaders, but the API route creates the context, injects auth/runtime values, and
mounts React Router, so its context helper belongs in `src/api/lib`.

Keep exported TypeScript types in adjacent `{moduleName}.types.ts` files. For
example, types for `src/api/lib/auth.ts` should live in
`src/api/lib/auth.types.ts`.

## UI route structure

Keep React Router route modules as flat files in `src/ui/routes` when they map
directly to a route path. For example, the `/billing` route module should be:

- `src/ui/routes/billing.tsx`

When a route needs supporting files, create a folder with the same route name
next to the route module:

- `src/ui/routes/billing/server.ts`: server-only route helpers, loader support,
  config normalization, and code that imports server-safe files.
- `src/ui/routes/billing/types.ts`: exported route data and component types for
  that route.
- `src/ui/routes/billing/components/*`: components that belong only to that
  route.

Do not move the route module itself into `src/ui/routes/{routeName}/index.tsx`
unless the route registration is intentionally changed to that file. Prefer the
flat route module plus sibling support folder pattern.

Use absolute imports with the `@src/*` alias throughout app code, including
imports between files in the same route folder. Avoid `./` and `../` imports
except where a tool or framework specifically requires them.

## UI components

Put reusable, app-wide UI building blocks directly in `src/ui/components`.
For example:

- `src/ui/components/button.tsx`

Put route-specific components inside the owning route support folder. For
example, a billing-only plan card belongs at:

- `src/ui/routes/billing/components/plan-card.tsx`

Do not place route-specific components in global component folders. Promote a
component to `src/ui/components` only when it is reused across multiple routes
and its API is intentionally generic.

## UI state

Use `src/ui/domain` for UI-owned domain state and actions that are shared by a
route and its components. This layer may use React and UI state libraries.
Keep business-domain rules that do not depend on React in `src/domain`.

Use Jotai for route workflow state when it gives a clear growth path. Prefer one
cohesive atom for small route workflows instead of many tiny atoms. For example,
billing state should live in `src/ui/domain/billing.ts` as one exported atom for
the billing workflow state, plus a hook that exposes actions and derived values.

Keep server-loaded route data in React Router loader data and pass it through
props. Do not duplicate loader data into Jotai unless the client must edit it or
share it outside the route lifecycle.

Keep async UI actions in the UI domain hook when they orchestrate client state
and client SDK calls. For example, billing actions such as attaching a plan or
opening the billing portal belong in `src/ui/domain/billing.ts`, while
server-only plan loading belongs in `src/ui/routes/billing/server.ts`.

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

`doppler run -c dev -- vite dev`

Do not start the local development server unless explicitly asked. Assume the
server is already running.

Doppler injects secrets into the process environment, and the Cloudflare Vite
plugin makes those bindings available to the Worker runtime. Do not mount or
generate `.dev.vars` for local development.

The `CLOUDFLARE_ENV` flag comes from Doppler. Keep it set to `dev` for the local
development project so the Cloudflare Vite plugin loads `env.dev` from
`wrangler.jsonc` when `vite dev` runs.

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
