import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";

import dbFactory from "@src/db/factory";
import type { Bindings } from "@src/lib/hono.types";

const baseConfig = {
  emailAndPassword: {
    enabled: true,
  },
};

export function fromEnv(e: Bindings) {
  const db = dbFactory.masterD1FromEnv(e);
  return betterAuth({
    ...baseConfig,
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
  });
}

export default betterAuth({
  ...baseConfig,
  database: {
    provider: "sqlite",
    // Passing an empty object prevents the CLI parser from executing queries,
    // while giving it enough structure to compile schemas smoothly.
    createInstance: () => ({}),
  },
});
