import { getLogger } from "@logtape/logtape";

import { createApp } from "@src/api/lib/hono";

const logger = getLogger(["api-routes", "health"]);
const app = createApp();

app.get("/health", (c) => {
  logger.info("Health check requested for {service}.", {
    environment: c.env.DOPPLER_ENVIRONMENT,
  });

  return c.json({
    ok: true,
    message: "🤍",
    environment: c.env.DOPPLER_ENVIRONMENT,
  });
});

export default app;
