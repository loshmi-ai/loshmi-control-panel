import { Hono } from "hono";

import type { Env } from "@src/api/lib/hono.types";

export function createApp() {
  return new Hono<Env>();
}
