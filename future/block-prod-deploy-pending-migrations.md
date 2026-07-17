# Block production deploys with pending migrations

Production Worker deploys should stop before `wrangler deploy` if any remote D1
database has pending migrations. Migrations should be applied first, then the
deploy can continue.

## Goal

- Check production D1 migration status as part of `bun run prd:deploy`.
- Fail the deploy when a production D1 database has unapplied migrations.
- Print the command the operator should run before retrying deploy.

## Notes

- Read production D1 bindings from `env.prd.d1_databases` in `wrangler.jsonc`.
- Use each binding name with Wrangler, for example:

```sh
doppler run -c prd -- bunx wrangler d1 migrations list MASTER_D1 --env prd --remote
```

- If pending migrations exist, tell the operator to run:

```sh
bun run prd:db:master-d1:migrations:apply
```

- Keep the check in an ops task so additional D1 databases can be added without
  duplicating package scripts.

## Possible implementation

Add a task such as:

```sh
bun src/ops/tasks/assert-no-pending-prd-d1-migrations.ts
```

Then run it before `prd:wrangler-deploy` in the production deploy script.
