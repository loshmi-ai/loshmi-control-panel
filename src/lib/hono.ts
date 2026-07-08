import { Hono } from "hono";

import type { Env } from "@src/lib/hono.types";

export function createApp() {
  return new Hono<Env>();
}
