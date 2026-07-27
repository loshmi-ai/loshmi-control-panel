import type { PropsWithChildren } from "react";

import type { AppShellUser } from "@src/ui/components/designSystem/app-shell.types";

export type PublicShellProps = PropsWithChildren<{
  user?: AppShellUser | null;
}>;
