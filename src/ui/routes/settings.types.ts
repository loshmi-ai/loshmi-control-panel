import type { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";

export type SettingsLoaderData = {
  user: ReturnType<typeof getUserOrRedirectToLogin>;
};
