import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router";

import type {
  AppShellProps,
  PanelProps,
} from "@src/ui/components/designSystem/app-shell.types";
import { Button } from "@src/ui/components/designSystem/button";
import { Variant } from "@src/ui/components/designSystem/variants";
import { useAuthActions } from "@src/ui/domain/auth";

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

  return (
    <nav className={clsx("flex items-center gap-3", "px-9 py-2 text-white")}>
      <Link className="" to="/dashboard">
        Loshmi
      </Link>
      <div className="ml-auto flex min-w-0 items-center gap-3">
        <Link className="text-sm font-semibold text-white/80" to="/billing">
          Billing
        </Link>
        <Link
          className="text-sm font-semibold text-white/80"
          to="/design-system"
        >
          Design System
        </Link>
        <Link className="text-sm font-semibold text-white/80" to="/settings">
          Settings
        </Link>
        <span className="hidden max-w-48 truncate text-sm text-white/60 sm:block">
          {user.email}
        </span>
        <Button
          className="min-h-0 px-0 py-0 text-sm text-white/80 shadow-none"
          disabled={auth.isSigningOut}
          type="button"
          variant={Variant.Minimal}
          onClick={() => void auth.signOut()}
        >
          {auth.isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
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
