import hono from "@src/domain/hono";

const app = hono.factory();

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "loshmi-control-panel",
    environment: c.env.DOPPLER_ENVIRONMENT,
  });
});

export default app;
