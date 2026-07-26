import { Link } from "react-router";

import type { AppShellProps } from "@src/ui/components/designSystem/app-shell.types";

function getUserInitial(userName?: string) {
  return userName?.trim().charAt(0).toUpperCase() || "L";
}

export function AppShell({
  actions = [],
  children,
  isSigningOut = false,
  searchPlaceholder = "Search settings, billing, routes, or status...",
  title,
  userEmail,
  userName,
  onSignOut,
}: AppShellProps) {
  void searchPlaceholder;

  return (
    <main className="h-screen w-full overflow-hidden">
      <div className="flex h-full w-full bg-stone-950 backdrop-blur-lg">
        <aside className="hidden w-14 shrink-0 flex-col items-center sm:flex">
          <span className="grid size-9 place-items-center rounded-full bg-blue-500 text-xs font-black text-white">
            L
          </span>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col text-white">
          <header className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <details className="group relative sm:hidden">
                <summary
                  aria-label="Profile menu"
                  className="grid size-10 shrink-0 cursor-pointer list-none place-items-center rounded-full border border-white/10 bg-blue-500 text-sm font-black text-white [&::-webkit-details-marker]:hidden"
                >
                  {getUserInitial(userName)}
                </summary>
                <div className="absolute top-[48px] left-0 z-20 w-52 rounded-3xl border border-slate-200 bg-white p-2 text-gray-950">
                  {userEmail ? (
                    <p className="truncate px-3 py-2 text-xs font-semibold text-slate-500">
                      {userEmail}
                    </p>
                  ) : null}
                  <Link
                    className="block rounded-full px-3 py-2 text-sm font-bold text-gray-950 hover:bg-slate-100"
                    to="/settings"
                  >
                    Settings
                  </Link>
                  <Link
                    className="block rounded-full px-3 py-2 text-sm font-bold text-gray-950 hover:bg-slate-100"
                    to="/billing"
                  >
                    Billing
                  </Link>
                  {onSignOut ? (
                    <button
                      className="block w-full cursor-pointer rounded-full border-0 bg-transparent px-3 py-2 text-left text-sm font-bold text-gray-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                      disabled={isSigningOut}
                      type="button"
                      onClick={onSignOut}
                    >
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  ) : null}
                </div>
              </details>
              <h1 className="truncate text-sm font-black text-white sm:text-base">
                {title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {actions.map((action) => (
                <Link
                  className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 mt-3 text-white px-4 text-sm font-bold whitespace-nowrap text-gray-950 shadow-[0_1px_2px_0_rgba(0,0,0,0.08)] transition hover:border-[#ccc] hover:bg-[#f7f7f7] hover:text-[#111]"
                  key={action.to}
                  to={action.to}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </header>

          <section className="min-h-0 flex-1 overflow-y-auto p-3 text-gray-950 sm:p-4">
            <div className="min-h-full rounded-[28px] bg-slate-50/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.24)] backdrop-blur sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.72rem] font-black tracking-[0.12em] text-slate-400 uppercase">
                    Loshmi Control Panel
                  </p>
                  <h1 className="mt-1 text-3xl leading-tight font-black text-gray-950 sm:text-4xl">
                    {title}
                  </h1>
                </div>
                {userEmail ? (
                  <p className="text-sm font-semibold text-slate-500">
                    {userEmail}
                  </p>
                ) : null}
              </div>
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
