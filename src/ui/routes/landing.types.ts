import type { getUser } from "@src/ui/lib/route-context.server";

export type LandingLoaderData = {
  user: ReturnType<typeof getUser>;
};
