import type { ExecutionContext } from "hono";

import type { BetterAuthSession } from "@src/api/lib/auth.types";
import type { Bindings } from "@src/api/lib/hono.types";

export type RrContext = {
  authCtx: BetterAuthSession;
  cfEnv: Bindings;
  cfCtx: ExecutionContext;
};
