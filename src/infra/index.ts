import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import { parse, printParseErrorCode, type ParseError } from "jsonc-parser";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WRANGLER_CONFIG_PATH = resolve(import.meta.dir, "../../wrangler.jsonc");
const WRANGLER_ENV = "prd";

type WranglerD1Database = {
  binding?: string;
  database_name?: string;
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
  const source = readFileSync(WRANGLER_CONFIG_PATH, "utf-8");
  const errors: ParseError[] = [];
  const config = parse(source, errors, { allowTrailingComma: true }) as
    | WranglerConfig
    | undefined;

  if (errors.length > 0) {
    const error = errors[0]!;
    throw new Error(
      `Could not parse wrangler.jsonc: ${printParseErrorCode(error.error)} at offset ${error.offset}.`,
    );
  }

  return config ?? {};
}

function getProductionD1Databases() {
  const databases = readWranglerConfig().env?.[WRANGLER_ENV]?.d1_databases;

  if (!databases || databases.length === 0) {
    throw new Error(
      `Could not find any D1 databases in env.${WRANGLER_ENV}.d1_databases in wrangler.jsonc.`,
    );
  }

  return databases.map((database, index) => {
    if (!database.binding) {
      throw new Error(
        `D1 database at env.${WRANGLER_ENV}.d1_databases[${index}] is missing binding.`,
      );
    }

    if (!database.database_name) {
      throw new Error(
        `D1 database ${database.binding} is missing database_name.`,
      );
    }

    return {
      binding: database.binding,
      databaseName: database.database_name,
    };
  });
}

function getResourceName(binding: string) {
  return `d1-${binding.toLowerCase().replaceAll("_", "-")}`;
}

const { CLOUDFLARE_ACCOUNT_ID } = process.env;

if (!CLOUDFLARE_ACCOUNT_ID) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID must be set.");
}

const d1Databases = getProductionD1Databases().map((database) => ({
  binding: database.binding,
  resource: new cloudflare.D1Database(getResourceName(database.binding), {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    name: database.databaseName,
  }),
}));

export const d1DatabaseIds = pulumi
  .all(
    d1Databases.map((database) =>
      database.resource.id.apply((id) => [database.binding, id] as const),
    ),
  )
  .apply((entries) => Object.fromEntries(entries));
