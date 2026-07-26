import type { getUserOrRedirectToLogin } from "@src/ui/lib/route-context.server";

export type SettingsLoaderData = {
  user: ReturnType<typeof getUserOrRedirectToLogin>;
};
