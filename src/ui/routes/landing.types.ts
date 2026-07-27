import type { getUser } from "@src/ui/domain/auth.server";

export type LandingLoaderData = {
  user: ReturnType<typeof getUser>;
};
