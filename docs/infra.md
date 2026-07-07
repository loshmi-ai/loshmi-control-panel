# Infra

This repo has one Pulumi app in `src/infra/`. It is not a standalone package: all
commands, dependencies, and the lockfile live at the repo root.

## Source of Truth

Production D1 databases are declared in `wrangler.jsonc` under:

```text
env.prd.d1_databases
```

Each production D1 entry must include:

- `binding`
- `database_name`

Pulumi reads that list and creates a Cloudflare D1 database for each entry. The
Pulumi output `d1DatabaseIds` is keyed by the Wrangler binding name, for example:

```json
{
  "MASTER_D1": "cloudflare-d1-database-id"
}
```

## Required Environment

Run production infra commands through Doppler. The Pulumi app expects:

- `CLOUDFLARE_ACCOUNT_ID`
- Cloudflare provider credentials, such as `CLOUDFLARE_API_TOKEN`

## Commands

Preview infra changes:

```sh
bun run prd:pulumi:preview
```

Refresh Pulumi state from Cloudflare:

```sh
bun run prd:pulumi:refresh
```

Apply infra changes:

```sh
bun run prd:pulumi:up
```

Print production stack outputs:

```sh
bun run prd:pulumi:stack-output
```

## One-Time D1 ID Sync

After creating or changing production D1 databases with Pulumi, sync the
Cloudflare database IDs back into `wrangler.jsonc`:

```sh
bun run prd:once:set-d1-database-ids
```

The script reads Pulumi's `d1DatabaseIds` output and updates matching
`env.prd.d1_databases[].database_id` values by `binding`.

It preserves JSONC comments and trailing commas, and fails if Pulumi outputs and
Wrangler production bindings do not match.

Infra-specific tasks live in `src/infra/tasks/`.
