import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router";

import type {
  AppShellProps,
  PanelProps,
} from "@src/ui/components/designSystem/app-shell.types";
import { useAuthActions } from "@src/ui/domain/auth";

// Ether to stitch everything onto
function Base({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "bg-black",
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
        <Link className="text-sm font-semibold text-white/80" to="/settings">
          Settings
        </Link>
        <span className="hidden max-w-48 truncate text-sm text-white/60 sm:block">
          {user.email}
        </span>
        <button
          className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-white/80 disabled:cursor-not-allowed disabled:text-white/40"
          disabled={auth.isSigningOut}
          type="button"
          onClick={() => void auth.signOut()}
        >
          {auth.isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </nav>
  );
}

function Panel({ children }: PanelProps): ReactElement {
  return (
    <main
      className={clsx(
        "flex-grow",
        "text-white",
        "bg-[#1C1C1E] rounded-3xl",
        "mx-2 mb-2 py-2 px-4",
        "flex-grow",
      )}
    >
      {children}
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
