import { DEFAULT_AUTH_REDIRECT } from "@src/constants";

export function safeRedirectTo(value: string | null | undefined) {
  if (typeof value !== "string") {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}
