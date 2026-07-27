import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Button } from "@src/ui/components/designSystem/button";
import { Variant } from "@src/ui/components/designSystem/variants";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { getRouteContext } from "@src/ui/lib/route-context.server";
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

  return (
    <AppShell
      env={loaderData.environment}
      renderedAt={loaderData.renderedAt}
      user={loaderData.user}
    >
      <p className="mt-4 leading-relaxed">
        Signed in as <strong>{loaderData.user.name}</strong>{" "}
        <span>({loaderData.user.email})</span>.
      </p>
      <p className="mt-6 leading-relaxed">
        Rendered in the Worker for <strong>{loaderData.environment}</strong> at{" "}
        <time dateTime={loaderData.renderedAt}>{loaderData.renderedAt}</time>.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="font-bold">Counter: {count}</span>
        <Button
          variant={Variant.Secondary}
          onClick={() => setCount((value) => value + 1)}
        >
          Increment
        </Button>
      </div>
    </AppShell>
  );
}
