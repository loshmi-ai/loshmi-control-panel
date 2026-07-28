import type { PropsWithChildren } from "react";
import type { LucideIcon } from "lucide-react";

export type PanelProps = PropsWithChildren<{}>;

export type AppShellUser = {
  email: string;
  name: string;
};

export type AppShellProps = PropsWithChildren<{
  env?: string;
  renderedAt?: string;
  user?: AppShellUser | null;
}>;

export type AppShellNavLink = {
  label: string;
  leftIcon: LucideIcon;
  to: string;
};
