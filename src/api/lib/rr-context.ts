import { createContext } from "react-router";

import type { RrContext } from "@src/api/lib/rr-context.types";

export const rrContext = createContext<RrContext>();
