import { getLogger } from "@logtape/logtape";
import { RouterContextProvider, createRequestHandler } from "react-router";

import { createApp } from "@src/api/lib/hono";
import { authenticateUserMiddleware } from "@src/api/middleware/authenticate-user";
import { rrContext } from "@src/api/lib/rr-context";

const logger = getLogger(["ui-routes", "react-router"]);

const reactRouterHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const app = createApp();

// Defer unknown paths to React Router.
app.all("*", authenticateUserMiddleware, (c) => {
  logger.info("UI route request received for {method} {path}.", {
    method: c.req.method,
    path: c.req.path,
  });

  const context = new RouterContextProvider();

  context.set(rrContext, {
    authSession: c.var.authSession,
    authUser: c.var.authUser,
    cfEnv: c.env,
    cfCtx: c.executionCtx,
  });

  return reactRouterHandler(c.req.raw, context);
});

export default app;
