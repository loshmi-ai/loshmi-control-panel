import { type LoaderFunctionArgs } from "react-router";

import { rrContext } from "@src/api/lib/rr-context";

export function getRouteContext({ context }: LoaderFunctionArgs) {
  return context.get(rrContext);
}
