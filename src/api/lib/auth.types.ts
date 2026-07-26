import type { Auth as BetterAuth } from "better-auth";

export type BetterAuthSession = BetterAuth["$Infer"]["Session"] | null;
