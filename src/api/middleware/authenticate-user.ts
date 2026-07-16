import { createMiddleware } from "hono/factory";

import { getSessionFromRequest } from "@src/api/lib/auth";
import type { Env } from "@src/api/lib/hono.types";

export const authenticateUserMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const session = await getSessionFromRequest(c.env, c.req.raw);

    if (session) {
      c.set("authSession", session);
      c.set("authUser", session.user);
    }

    await next();
  },
);
