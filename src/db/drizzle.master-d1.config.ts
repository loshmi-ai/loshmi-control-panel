import type { Config } from "drizzle-kit";
import { existsSync } from "node:fs";

import {
  getLocalD1DatabasePathForId,
  getWranglerD1DatabaseLocalId,
} from "@src/db/util";

// Use local D1 DB for dev environment, using settings from this comment
// https://github.com/drizzle-team/drizzle-orm/discussions/1545#discussioncomment-9642932

const {
  DOPPLER_ENVIRONMENT,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_D1_DB_ID,
} = process.env;

const isLocal = DOPPLER_ENVIRONMENT === "dev";
const MASTER_D1_DATABASE_ID = "master-d1";

function getLocalD1DB() {
  const lookup = {
    databaseId: MASTER_D1_DATABASE_ID,
    env: "dev",
  };
  const localDatabaseName = getWranglerD1DatabaseLocalId(lookup);
  const localD1Path = getLocalD1DatabasePathForId(lookup);

  if (!existsSync(localD1Path)) {
    throw new Error(
      `Could not find local D1 database at ${localD1Path}. Run wrangler dev or wrangler d1 execute locally for ${localDatabaseName} first.`,
    );
  }

  return localD1Path;
}

const config = {
  schema: "./src/db/schema.master-d1.ts",
  out: "./migrations/master-d1",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  ...(isLocal
    ? {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      }
    : {
        driver: "d1-http",
        dbCredentials: {
          accountId: CLOUDFLARE_ACCOUNT_ID,
          token: CLOUDFLARE_API_TOKEN,
          databaseId: CLOUDFLARE_D1_DB_ID,
        },
      }),
} as Config;

export default config;
