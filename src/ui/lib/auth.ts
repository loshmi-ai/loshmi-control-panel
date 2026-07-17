import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";

import { DEFAULT_AUTH_REDIRECT } from "@src/constants";

export const authClient = createAuthClient({
  plugins: [passkeyClient()],
});

export function safeRedirectTo(value: string | null | undefined) {
  if (typeof value !== "string") {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}
