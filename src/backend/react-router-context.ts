import { createContext } from "react-router";
import type { ExecutionContext } from "hono";

import type { Bindings } from "@src/lib/hono.types";

export type CloudflareRequestContext = {
  env: Bindings;
  ctx: ExecutionContext;
};

export const cloudflareContext = createContext<CloudflareRequestContext>();
