import { createContext } from "react-router";

import type { RrContext } from "@src/ui/lib/rr-context.types";

export const rrContext = createContext<RrContext>();
