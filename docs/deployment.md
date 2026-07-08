# Deployment

Production deployment has two parts: infra setup and Worker deployment.

## Required Environment

Run production deployment commands through Doppler. The `prd` Doppler config must
include:

- `CLOUDFLARE_ENV=prd`
- `CLOUDFLARE_ACCOUNT_ID`
- Cloudflare provider credentials, such as `CLOUDFLARE_API_TOKEN`
- Any runtime secrets the Worker needs

The package scripts intentionally wrap production commands with
`doppler run -c prd -- ...`. Do not pass `--env=prd` to Wrangler scripts here;
production environment selection is expected to come from `CLOUDFLARE_ENV` in
Doppler. The deploy script runs the Vite build inside that Doppler wrapper so
the generated `build/server/wrangler.json` targets the production environment
before `wrangler deploy` reads the redirected config.

## Infra Prerequisite

Infra must exist before the Worker can be deployed successfully. Use the infra
commands documented in `docs/infra.md`.

## First-Time Deployment

After infra is ready, deploy the Worker and sync Worker secrets in series:

```sh
bun run prd:deploy
```

This runs:

```sh
bun run prd:deploy-worker
bun run prd:sync-secrets
```

## Routine Deployment

Deploy code changes with:

```sh
bun run prd:deploy-worker
```

When Doppler runtime secrets change, sync secrets directly:

```sh
bun run prd:sync-secrets
```

or:

```sh
bun run prd:deploy
```

## Secret Sync

`prd:sync-secrets` treats Doppler `prd` as the source of truth for Worker
secrets. It fetches Doppler secrets, excludes keys that start with `PULUMI_` or
`DOPPLER_`, upserts the remaining keys into the Worker, and deletes remote
Worker secrets that are no longer present in that filtered set.

The task logs secret names and counts only. It never prints secret values.
