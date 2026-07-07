import { getLocalD1DatabasePath } from "./util";
import type { Config } from "drizzle-kit";
import fs from "fs";
import ts from "typescript";

// Use local D1 DB for dev environment, using settings from this comment
// https://github.com/drizzle-team/drizzle-orm/discussions/1545#discussioncomment-9642932

const {
  DOPPLER_ENVIRONMENT,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_D1_DB_ID,
} = process.env;

const isLocal = DOPPLER_ENVIRONMENT === "dev";
const WRANGLER_CONFIG_PATH = "wrangler.jsonc";
const LOCAL_WRANGLER_ENV = "dev";
const MASTER_D1_BINDING = "MASTER_D1";

type WranglerD1Database = {
  binding?: string;
  database_id?: string;
  preview_database_id?: string;
};

type WranglerConfig = {
  env?: Record<
    string,
    {
      d1_databases?: WranglerD1Database[];
    }
  >;
};

function readWranglerConfig() {
  const source = fs.readFileSync(WRANGLER_CONFIG_PATH, "utf-8");
  const parsed = ts.parseConfigFileTextToJson(WRANGLER_CONFIG_PATH, source);

  if (parsed.error) {
    throw new Error(
      `Could not parse ${WRANGLER_CONFIG_PATH}: ${ts.flattenDiagnosticMessageText(
        parsed.error.messageText,
        "\n",
      )}`,
    );
  }

  return parsed.config as WranglerConfig;
}

function getLocalD1DatabaseName() {
  const wranglerConfig = readWranglerConfig();
  const d1Database = wranglerConfig.env?.[
    LOCAL_WRANGLER_ENV
  ]?.d1_databases?.find((database) => database.binding === MASTER_D1_BINDING);

  if (!d1Database) {
    throw new Error(
      `Could not find ${MASTER_D1_BINDING} D1 binding in env.${LOCAL_WRANGLER_ENV}.d1_databases in ${WRANGLER_CONFIG_PATH}.`,
    );
  }

  const localDatabaseName =
    d1Database.preview_database_id ??
    d1Database.database_id ??
    d1Database.binding;

  if (!localDatabaseName) {
    throw new Error(
      `Could not determine local D1 database name for ${MASTER_D1_BINDING}. Set preview_database_id in ${WRANGLER_CONFIG_PATH}.`,
    );
  }

  return localDatabaseName;
}

function getLocalD1DB() {
  const localDatabaseName = getLocalD1DatabaseName();
  const localD1Path = getLocalD1DatabasePath(localDatabaseName);

  if (!fs.existsSync(localD1Path)) {
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
