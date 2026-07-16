import type { ExecutionContext } from "hono";

import type { AuthSession } from "@src/api/lib/auth.types";
import type { Bindings } from "@src/api/lib/hono.types";

export type RrContext = {
  authSession?: AuthSession;
  authUser?: NonNullable<AuthSession>["user"];
  cfEnv: Bindings;
  cfCtx: ExecutionContext;
};
