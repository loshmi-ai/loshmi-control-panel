# Billing

Autumn is the billing and entitlement source of truth. The local pricing config
lives in `autumn.config.ts` and is synced with Autumn through the `atmn` CLI.

## Current Plans

Use `autumn.config.ts` as the only source of truth for current plan ids,
pricing, and entitlements.

## Plan Versioning

Keep the plan id stable and update `autumn.config.ts` when the package changes.
Autumn versions plans with existing customers, keeps old customers
grandfathered, and lets us migrate them from Autumn when ready.

## Operations

Autumn CLI auth must be available in Doppler before pushing. The package
scripts call `atmn` directly:

- `AUTUMN_SECRET_KEY` in Doppler `dev`: sandbox Autumn secret key, used by
  `bun dev:autumn:push`
- `AUTUMN_PROD_SECRET_KEY` in Doppler `prd`: production Autumn secret key, used by
  `bun prd:autumn:push`

Preview the Autumn plan locally:

```sh
bun dev:autumn:preview
```

Push to Autumn sandbox:

```sh
bun dev:autumn:push
```

Push to Autumn production:

```sh
bun prd:autumn:push
```

Pass `--yes` manually to auto-confirm Autumn prompts when appropriate.
