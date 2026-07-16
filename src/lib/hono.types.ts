import type { D1Database } from "@cloudflare/workers-types";

import type { AuthSession } from "@src/lib/auth.types";

export type Variables = {
  authSession?: AuthSession;
  authUser?: NonNullable<AuthSession>["user"];
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

  DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
};
