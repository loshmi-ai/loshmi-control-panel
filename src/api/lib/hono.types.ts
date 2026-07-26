import type { D1Database } from "@cloudflare/workers-types";

import type { BetterAuthSession } from "@src/api/lib/auth.types";

export type Variables = {
  authCtx?: BetterAuthSession;
};

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};

export type Bindings = {
  // Cloudflare Infra
  // -------------------------------------------------
  MASTER_D1: D1Database; // Main app database

  // Cloudflare credentials needed to read D1Database
  // -------------------------------------------------
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_D1_DB_ID: string;

  // App
  // -------------------------------------------------
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  AUTUMN_SECRET_KEY: string;

  DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
};
