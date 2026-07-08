import {
  applyEdits,
  findNodeAtLocation,
  modify,
  parse,
  printParseErrorCode,
  type ParseError,
} from "jsonc-parser";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const WRANGLER_CONFIG_PATH = resolve(import.meta.dir, "../../../wrangler.jsonc");
const PULUMI_CWD = "src/infra";
const PULUMI_STACK = "prd";
const WRANGLER_ENV = "prd";
const PULUMI_OUTPUT_NAME = "d1DatabaseIds";

type WranglerD1Database = {
  binding?: string;
  database_id?: string;
};

type WranglerConfig = {
  env?: Record<
    string,
    {
      d1_databases?: WranglerD1Database[];
    }
  >;
};

async function readPulumiD1DatabaseIds() {
  const proc = Bun.spawn(
    [
      "pulumi",
      "stack",
      "output",
      PULUMI_OUTPUT_NAME,
      "--json",
      "--cwd",
      PULUMI_CWD,
      "--stack",
      PULUMI_STACK,
    ],
    {
      stderr: "pipe",
      stdout: "pipe",
    },
  );

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(
      `Could not read Pulumi output ${PULUMI_OUTPUT_NAME} from ${PULUMI_STACK}: ${stderr.trim()}`,
    );
  }

  const parsed = JSON.parse(stdout) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      `Pulumi output ${PULUMI_OUTPUT_NAME} must be an object keyed by D1 binding.`,
    );
  }

  return parsed as Record<string, string>;
}

function readWranglerConfig(source: string) {
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

function getProductionD1Databases(config: WranglerConfig) {
  const databases = config.env?.[WRANGLER_ENV]?.d1_databases;

  if (!databases || databases.length === 0) {
    throw new Error(
      `Could not find any D1 databases in env.${WRANGLER_ENV}.d1_databases in wrangler.jsonc.`,
    );
  }

  return databases;
}

function validateOutputs(
  databases: WranglerD1Database[],
  d1DatabaseIds: Record<string, string>,
) {
  const bindings = databases.map((database, index) => {
    if (!database.binding) {
      throw new Error(
        `D1 database at env.${WRANGLER_ENV}.d1_databases[${index}] is missing binding.`,
      );
    }

    return database.binding;
  });

  const expectedBindings = new Set(bindings);
  const outputBindings = new Set(Object.keys(d1DatabaseIds));

  for (const binding of expectedBindings) {
    const databaseId = d1DatabaseIds[binding];

    if (typeof databaseId !== "string" || databaseId.length === 0) {
      throw new Error(
        `Pulumi output ${PULUMI_OUTPUT_NAME} is missing a database id for ${binding}.`,
      );
    }
  }

  for (const binding of outputBindings) {
    if (!expectedBindings.has(binding)) {
      throw new Error(
        `Pulumi output ${PULUMI_OUTPUT_NAME} contains ${binding}, but wrangler.jsonc has no matching production D1 binding.`,
      );
    }
  }
}

function hasDatabaseIdProperty(source: string, databaseIndex: number) {
  const root = parse(source, undefined, { allowTrailingComma: true });
  return Boolean(
    findNodeAtLocation(root, [
      "env",
      WRANGLER_ENV,
      "d1_databases",
      databaseIndex,
      "database_id",
    ]),
  );
}

async function main() {
  const source = readFileSync(WRANGLER_CONFIG_PATH, "utf-8");
  const config = readWranglerConfig(source);
  const databases = getProductionD1Databases(config);
  const d1DatabaseIds = await readPulumiD1DatabaseIds();

  validateOutputs(databases, d1DatabaseIds);

  let updatedSource = source;

  databases.forEach((database, index) => {
    const binding = database.binding!;
    const databaseId = d1DatabaseIds[binding]!;
    const formattingOptions = {
      eol: "\n",
      insertSpaces: true,
      tabSize: 2,
    };

    const path = [
      "env",
      WRANGLER_ENV,
      "d1_databases",
      index,
      "database_id",
    ];

    const edits = modify(updatedSource, path, databaseId, {
      formattingOptions,
      getInsertionIndex: hasDatabaseIdProperty(updatedSource, index)
        ? undefined
        : (properties) => properties.length,
    });

    updatedSource = applyEdits(updatedSource, edits);
  });

  writeFileSync(WRANGLER_CONFIG_PATH, updatedSource);

  console.log(
    `Updated ${databases.length} production D1 database id(s) in wrangler.jsonc.`,
  );
}

await main();
