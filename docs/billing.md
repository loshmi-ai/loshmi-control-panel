# Billing

Autumn is the billing and entitlement source of truth. The local pricing config
lives in `autumn.config.ts` and is synced with Autumn through the `atmn` CLI.

## Current Plan

- Name: Loshmi One
- Plan id: `loshmi_one`
- Price: $24.99/month

## Plan Versioning

Keep the plan id stable and update `autumn.config.ts` when the package changes.
Autumn versions plans with existing customers, keeps old customers
grandfathered, and lets us migrate them from Autumn when ready.

## Operations

Autumn CLI auth must be available in Doppler before pushing. The ops command
wraps `atmn push` with Doppler:

- `AUTUMN_SECRET_KEY` in Doppler `dev`: sandbox Autumn secret key, used by
  `doppler run -c dev -- bunx atmn push`
- `AUTUMN_PROD_SECRET_KEY` in Doppler `prd`: production Autumn secret key, used by
  `doppler run -c prd -- bunx atmn push --prod`

Preview the Autumn plan locally:

```sh
bun run ops billing preview
```

Push to Autumn sandbox:

```sh
bun run ops billing push
```

Push to Autumn production:

```sh
bun run ops billing push --prod
```

Add `--yes` to auto-confirm Autumn prompts when appropriate.
