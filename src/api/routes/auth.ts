import { getLogger } from "@logtape/logtape";

import * as auth from "@src/api/lib/auth";
import { createApp } from "@src/api/lib/hono";

const logger = getLogger(["api-routes", "auth"]);
const app = createApp();

// Mount Better Auth's API routes for client auth calls and session cookies.
app.on(["GET", "POST"], "/auth/*", (c) => {
  logger.info("Auth API request received for {method} {path}.", {
    method: c.req.method,
    path: c.req.path,
  });

  return auth.fromEnv(c.env).handler(c.req.raw);
});

export default app;
