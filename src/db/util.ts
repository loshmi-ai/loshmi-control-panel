import { parse } from "jsonc-parser";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  MINIFLARE_D1_OBJECT_DIR,
  MINIFLARE_D1_OBJECT_UNIQUE_KEY,
  WRANGLER_CONFIG_PATH,
} from "@src/constants";
import type {
  WranglerConfig,
  WranglerD1DatabaseLookup,
} from "@src/db/util.types";

export function getWranglerD1DatabaseLocalId(lookup: WranglerD1DatabaseLookup) {
  const d1Database = getWranglerD1Database(lookup);
  const localDatabaseId =
    d1Database.preview_database_id ??
    d1Database.database_id ??
    d1Database.binding;

  if (!localDatabaseId) {
    throw new Error(
      `Could not determine local D1 database id for ${lookup.databaseId}. Set preview_database_id in ${lookup.configPath ?? WRANGLER_CONFIG_PATH}.`,
    );
  }

  return localDatabaseId;
}

export function getLocalD1DatabasePathForId(lookup: WranglerD1DatabaseLookup) {
  return getLocalD1DatabasePath(getWranglerD1DatabaseLocalId(lookup));
}

function readWranglerConfig(configPath = WRANGLER_CONFIG_PATH) {
  return parse(readFileSync(configPath, "utf-8")) as WranglerConfig;
}

function getWranglerD1Database({
  configPath = WRANGLER_CONFIG_PATH,
  databaseId,
  env,
}: WranglerD1DatabaseLookup) {
  const wranglerConfig = readWranglerConfig(configPath);
  const d1Database = wranglerConfig.env?.[env]?.d1_databases?.find(
    (database) =>
      database.binding && getD1DatabaseId(database.binding) === databaseId,
  );

  if (!d1Database) {
    throw new Error(
      `Could not find ${databaseId} D1 database in env.${env}.d1_databases in ${configPath}.`,
    );
  }

  return d1Database;
}

function getD1DatabaseId(binding: string) {
  return binding.toLowerCase().replaceAll("_", "-");
}

function getLocalD1DatabaseHash(localDatabaseId: string) {
  const key = createHash("sha256")
    .update(MINIFLARE_D1_OBJECT_UNIQUE_KEY)
    .digest();

  const nameHmac = createHmac("sha256", key)
    .update(localDatabaseId)
    .digest()
    .subarray(0, 16);

  const hmac = createHmac("sha256", key)
    .update(nameHmac)
    .digest()
    .subarray(0, 16);

  return Buffer.concat([nameHmac, hmac]).toString("hex");
}

function getLocalD1DatabasePath(localDatabaseId: string) {
  return resolve(
    ".wrangler/state/v3/d1",
    MINIFLARE_D1_OBJECT_DIR,
    `${getLocalD1DatabaseHash(localDatabaseId)}.sqlite`,
  );
}
