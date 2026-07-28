import clsx from "clsx";
import {
  CreditCard,
  LogIn,
  LogOut,
  Palette,
  Settings,
} from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router";

import type {
  AppShellNavLink,
  AppShellProps,
  PanelProps,
} from "@src/ui/components/app-shell.types";
import { AnchorButton, Button } from "@src/ui/components/button";
import { Variant } from "@src/ui/components/variants";
import { useAuthActions } from "@src/ui/domain/auth";

const authenticatedNavLinks = {
  billing: { label: "Billing", leftIcon: CreditCard, to: "/billing" },
  designSystem: {
    label: "Design System",
    leftIcon: Palette,
    to: "/design-system",
  },
  settings: { label: "Settings", leftIcon: Settings, to: "/settings" },
} satisfies Record<string, AppShellNavLink>;

const publicNavLinks = {
  login: { label: "Log in", leftIcon: LogIn, to: "/login" },
} satisfies Record<string, AppShellNavLink>;

// Ether to stitch everything onto
function Base({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "bg-neutral-950",
        "flex flex-col",
        "h-screen w-full",
        "overflow-hidden",
      )}
    >
      {children}
    </div>
  );
}

function Nav({ user }: { user: AppShellProps["user"] }): ReactElement {
  const auth = useAuthActions();
  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  return (
    <nav className={clsx("flex items-center", "px-9 py-2 text-white")}>
      <Link to={user ? "/dashboard" : "/"} className="flex items-center">
        <img
          alt="Loshmi Cat Logo"
          aria-hidden="true"
          className="size-9 shrink-0"
          src="/loshmi-cat.svg"
        />
        Loshmi
      </Link>
      <div className="ml-auto flex min-w-0 items-center">
        {Object.values(navLinks).map((link) => (
          <AnchorButton
            className="font-normal"
            key={link.to}
            leftIcon={link.leftIcon}
            to={link.to}
            variant={Variant.Minimal}
          >
            {link.label}
          </AnchorButton>
        ))}
        {user ? (
          <>
            <span className="hidden max-w-48 truncate text-sm text-white/60 sm:block">
              {user.name || user.email}
            </span>
            <Button
              className="font-normal"
              leftIcon={LogOut}
              loading={auth.isSigningOut}
              variant={Variant.Minimal}
              onClick={() => void auth.signOut()}
            >
              Sign out
            </Button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

function Panel({ children }: PanelProps): ReactElement {
  return (
    <main
      className={clsx(
        "min-h-0 flex-grow overflow-hidden",
        "text-white",
        // "bg-[#1C1C1E] rounded-3xl",
        "bg-neutral-900 rounded-2xl",
        "mx-2 mb-2",
      )}
    >
      <div className="scrollbar-soft my-1 mr-1 h-[calc(100%-0.5rem)] overflow-y-auto px-4 py-2 [scrollbar-gutter:stable]">
        {children}
      </div>
    </main>
  );
}

export function AppShell(props: AppShellProps) {
  const { children, env, renderedAt, user } = props;
  void env;
  void renderedAt;

  return (
    <Base>
      <Nav user={user} />
      <Panel>{children}</Panel>
    </Base>
  );
}
