import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { redirect } from "react-router";

import dbFactory from "@src/db/factory";
import * as masterD1Schema from "@src/db/schema.master-d1";
import type { Bindings } from "@src/lib/hono.types";

const baseConfig = {
  emailAndPassword: {
    enabled: true,
  },
  experimental: {
    joins: true,
  },
};

export function fromEnv(e: Bindings) {
  const db = dbFactory.masterD1FromEnv(e);
  return betterAuth({
    ...baseConfig,
    secret: e.BETTER_AUTH_SECRET,
    baseURL: e.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: masterD1Schema,
    }),
  });
}

export async function getSessionFromRequest(e: Bindings, request: Request) {
  return fromEnv(e).api.getSession({
    headers: request.headers,
  });
}

export async function requireAuth(e: Bindings, request: Request) {
  const session = await getSessionFromRequest(e, request);

  if (!session) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return session;
}
