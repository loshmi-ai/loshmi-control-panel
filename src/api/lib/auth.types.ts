import type { Auth as BetterAuth } from "better-auth";

export type AuthSession = BetterAuth["$Infer"]["Session"] | null;
