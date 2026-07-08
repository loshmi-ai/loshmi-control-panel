import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
