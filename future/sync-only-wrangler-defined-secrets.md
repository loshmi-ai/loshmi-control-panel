# Sync only Wrangler-defined secrets

Production secret sync should only sync secrets declared in `wrangler.jsonc`,
instead of syncing every Doppler secret after filtering provider-specific keys.

## Goal

- Treat `wrangler.jsonc` as the allowlist for Worker runtime secrets.
- Read required secret names from `env.prd.secrets.required`.
- Upsert only those named secrets from Doppler into the Worker.
- Delete remote Worker secrets only when they are no longer declared in
  `wrangler.jsonc`.

## Current declaration

```jsonc
"secrets": {
  "required": ["BETTER_AUTH_URL", "BETTER_AUTH_SECRET"],
}
```

## Notes

- Fail early if a required secret is declared in `wrangler.jsonc` but missing
  from Doppler `prd`.
- Do not sync Pulumi, Doppler, or other operational secrets unless they are
  explicitly declared for the Worker.
- Keep logging to secret names and counts only. Never print secret values.
- Prefer a reusable parser for `wrangler.jsonc` so future environments can share
  the same allowlist behavior.
