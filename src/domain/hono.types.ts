import { D1Database } from "@cloudflare/workers-types";

export type Variables = Record<string, never>;

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
  DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
};
