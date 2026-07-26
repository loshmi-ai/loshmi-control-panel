import type { getUserOrRedirectToLogin } from "@src/ui/lib/route-context.server";

export type DashboardLoaderData = {
  environment: string;
  renderedAt: string;
  user: ReturnType<typeof getUserOrRedirectToLogin>;
};
