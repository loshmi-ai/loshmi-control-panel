import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router";

import type { PublicShellProps } from "@src/ui/components/designSystem/public-shell.types";

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

function Nav({ user }: Pick<PublicShellProps, "user">): ReactElement {
  return (
    <nav className={clsx("flex items-center gap-3", "px-9 py-2 text-white")}>
      <Link to="/">Loshmi</Link>
      <div className="ml-auto flex min-w-0 items-center gap-3">
        <a
          className="text-sm font-semibold text-white/90"
          href="mailto:founders@metablocks.world"
        >
          Waitlist
        </a>
        {user ? (
          <>
            <Link
              className="text-sm font-semibold text-white/90"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <span className="hidden max-w-48 truncate text-sm text-white/60 sm:block">
              {user.name || user.email}
            </span>
          </>
        ) : (
          <Link className="text-sm font-semibold text-white/90" to="/login">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

function Panel({ children }: { children: ReactNode }): ReactElement {
  return (
    <main
      className={clsx(
        "min-h-0 flex-grow overflow-hidden",
        "text-white",
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

export function PublicShell(props: PublicShellProps) {
  const { children, user } = props;

  return (
    <Base>
      <Nav user={user} />
      <Panel>{children}</Panel>
    </Base>
  );
}
