import { autumnHandler } from "autumn-js/hono";

import { getSessionFromRequest } from "@src/api/lib/auth";
import { createApp } from "@src/api/lib/hono";

const app = createApp();

app.use("/autumn/*", async (c, next) => {
  const handler = autumnHandler({
    secretKey: c.env.AUTUMN_SECRET_KEY,
    identify: async () => {
      const session = await getSessionFromRequest(c.env, c.req.raw);

      if (!session) {
        return null;
      }

      return {
        customerId: session.user.id,
        customerData: {
          name: session.user.name,
          email: session.user.email,
        },
      };
    },
  });

  return handler(c, next);
});

export default app;
