import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { getLogger } from "@logtape/logtape";
import { betterAuth } from "better-auth";
import { redirect } from "react-router";

import type { AuthSession } from "@src/api/lib/auth.types";
import type { Bindings } from "@src/api/lib/hono.types";
import dbFactory from "@src/db/factory";
import * as masterD1Schema from "@src/db/schema.master-d1";

const logger = getLogger(["api-lib", "auth"]);

const baseConfig = {
  emailAndPassword: {
    enabled: true,
  },
  experimental: {
    joins: true,
  },
};

export function fromEnv(e: Bindings) {
  const authUrl = new URL(e.BETTER_AUTH_URL);

  logger.info("Creating Better Auth service for {baseURL}.", {
    baseURL: e.BETTER_AUTH_URL,
  });

  const db = dbFactory.masterD1FromEnv(e);
  return betterAuth({
    ...baseConfig,
    secret: e.BETTER_AUTH_SECRET,
    baseURL: e.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: masterD1Schema,
    }),
    plugins: [
      passkey({
        origin: authUrl.origin,
        rpID: authUrl.hostname,
        rpName: "Loshmi",
      }),
    ],
  });
}

export async function getSessionFromRequest(e: Bindings, request: Request) {
  return fromEnv(e).api.getSession({
    headers: request.headers,
  });
}

export function requireAuthSession(
  session: AuthSession | undefined,
  request: Request,
) {
  if (!session) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return session;
}
