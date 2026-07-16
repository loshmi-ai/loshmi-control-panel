import type { fromEnv } from "@src/lib/auth";

export type AuthSession = Awaited<
  ReturnType<ReturnType<typeof fromEnv>["api"]["getSession"]>
>;
