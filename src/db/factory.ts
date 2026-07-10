import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { Context } from "hono";
import { env } from "hono/adapter";

import * as masterD1Schema from "@src/db/schema.master-d1";
import type { Bindings } from "@src/lib/hono.types";

function masterD1FromContext(c: Context) {
  return masterD1FromEnv(env(c));
}

function masterD1FromEnv(e: Bindings) {
  const db = drizzleD1(e.MASTER_D1, {
    schema: masterD1Schema,
  });

  return db;
}

export default {
  masterD1FromContext,
  masterD1FromEnv,
};
