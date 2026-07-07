import { Hono } from "hono";

import type { Bindings, Variables } from "@src/domain/hono.types";

function factory() {
  return new Hono<{ Variables: Variables; Bindings: Bindings }>();
}

export default {factory}
