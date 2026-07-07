import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { Context } from "hono";
import { env } from "hono/adapter";

import * as masterD1Schema from "@src/db/schema.master-d1";
import type { Bindings } from "@src/domain/hono.types";

// SQLite database factory
function d1DBfromContext(c: Context) {
  return d1DbFromEnv(env(c));
}

function d1DbFromEnv(e: Bindings) {
  const db = drizzleD1(e.MASTER_D1, {
    schema: masterD1Schema,
  });

  return db;
}

export default {
  d1DBfromContext,
  d1DbFromEnv,
};
