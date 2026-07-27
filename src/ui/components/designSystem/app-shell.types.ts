import type { PropsWithChildren } from "react";

export type PanelProps = PropsWithChildren<{
  depth?: number;
}>;

export type AppShellUser = {
  email: string;
  name: string;
};

export type AppShellProps = PropsWithChildren<{
  env?: string;
  renderedAt?: string;
  user: AppShellUser;
}>;
