import { getLogger } from "@logtape/logtape";
import { RouterContextProvider, createRequestHandler } from "react-router";

import { cloudflareContext } from "@src/backend/react-router-context";
import { createApp } from "@src/lib/hono";
import type { Bindings } from "@src/lib/hono.types";
import "@src/lib/log";

const logger = getLogger(["loshmi-control-panel", "backend"]);

const reactRouterHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const app = createApp();

app.get("/health", (c) => {
  logger.info("Health check requested for {service}.", {
    environment: c.env.DOPPLER_ENVIRONMENT,
    service: "loshmi-control-panel",
  });

  return c.json({
    ok: true,
    service: "loshmi-control-panel",
    environment: c.env.DOPPLER_ENVIRONMENT,
  });
});

// Chrome DevTools probes this URL automatically; answer before React Router
// logs it as an application 404 on every page load.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (c) => {
  return c.body(null, 204);
});

// Defer unknown paths to React Router
app.all("*", (c) => {
  const context = new RouterContextProvider();

  context.set(cloudflareContext, {
    env: c.env,
    ctx: c.executionCtx,
  });

  return reactRouterHandler(c.req.raw, context);
});

export default app satisfies ExportedHandler<Bindings>;
