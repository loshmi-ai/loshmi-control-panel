import type { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";

export type DashboardLoaderData = {
  environment: string;
  renderedAt: string;
  user: ReturnType<typeof getUserOrRedirectToLogin>;
};
