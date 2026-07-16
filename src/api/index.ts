import { createApp } from "@src/api/lib/hono";
import type { Bindings } from "@src/api/lib/hono.types";
import authRoutes from "@src/api/routes/auth";
import devtoolsRoutes from "@src/api/routes/devtools";
import healthRoutes from "@src/api/routes/health";
import uiRoutes from "@src/api/routes/ui";
import "@src/lib/log";

// API Endpoints
// -------------------------------------------
const api = createApp();
api.route("/", authRoutes);
api.route("/", healthRoutes);

// App - API, UI, and Misc endpoints
// -------------------------------------------
const app = createApp();
app.route("/api", api);
app.route("/", devtoolsRoutes);
app.route("/", uiRoutes); // React Router mounts in the end, acts as a catch-all route

export default app satisfies ExportedHandler<Bindings>;
