import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/design-system", "routes/design-system.tsx"),
  route("/design-system/frame", "routes/design-system/frame.tsx"),
  route("/billing", "routes/billing.tsx"),
  route("/settings", "routes/settings.tsx"),
] satisfies RouteConfig;
