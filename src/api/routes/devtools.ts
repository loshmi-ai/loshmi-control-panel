import { createApp } from "@src/api/lib/hono";

const app = createApp();

// Chrome DevTools probes this URL automatically; answer before React Router
// logs it as an application 404 on every page load.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (c) => {
  return c.body(null, 204);
});

export default app;
