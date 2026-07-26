import type { ReactNode } from "react";

export type AppShellNavItem = {
  label: string;
  shortLabel: string;
  to: string;
};

export type AppShellAction = {
  label: string;
  to: string;
};

export type AppShellProps = {
  actions?: AppShellAction[];
  children: ReactNode;
  isSigningOut?: boolean;
  navItems: AppShellNavItem[];
  searchPlaceholder?: string;
  title: string;
  userEmail?: string;
  userName?: string;
  onSignOut?: () => void;
};
