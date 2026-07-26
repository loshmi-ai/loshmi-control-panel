import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Button } from "@src/ui/components/designSystem/button";
import { authClient } from "@src/ui/lib/auth";
import {
  getRouteContext,
  getUserOrRedirectToLogin,
} from "@src/ui/lib/route-context.server";
import type { DashboardLoaderData } from "@src/ui/routes/dashboard.types";

export function meta() {
  return [{ title: "Dashboard | Loshmi Control Panel" }];
}

export async function loader(
  args: LoaderFunctionArgs,
): Promise<DashboardLoaderData> {
  const rrContextValue = getRouteContext(args);
  const user = getUserOrRedirectToLogin(args);

  return {
    environment: rrContextValue.cfEnv.DOPPLER_ENVIRONMENT,
    renderedAt: new Date().toISOString(),
    user,
  };
}

export default function Dashboard({
  loaderData,
}: {
  loaderData: DashboardLoaderData;
}) {
  const [count, setCount] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    window.location.assign("/login");
  }

  return (
    <AppShell
      actions={[{ label: "Home", to: "/" }]}
      isSigningOut={isSigningOut}
      navItems={[{ label: "Dashboard", shortLabel: "D", to: "/dashboard" }]}
      title="Dashboard"
      userEmail={loaderData.user.email}
      userName={loaderData.user.name}
      onSignOut={handleSignOut}
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-7">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Dashboard
        </p>
        <h1 className="text-4xl leading-tight font-bold">SSR dashboard</h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          Signed in as <strong>{loaderData.user.name}</strong>{" "}
          <span className="text-slate-500">({loaderData.user.email})</span>.
        </p>
        <p className="mt-6 leading-relaxed text-slate-600">
          Rendered in the Worker for <strong>{loaderData.environment}</strong>{" "}
          at{" "}
          <time dateTime={loaderData.renderedAt}>{loaderData.renderedAt}</time>.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-bold">Counter: {count}</span>
          <Button
            variant="secondary"
            onClick={() => setCount((value) => value + 1)}
          >
            Increment
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
