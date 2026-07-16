import { useState } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";

import { requireAuthSession } from "@src/api/lib/auth";
import { authClient } from "@src/ui/lib/auth";
import { rrContext } from "@src/ui/lib/rr-context";

export function meta() {
  return [{ title: "Dashboard | Loshmi Control Panel" }];
}

type DashboardLoaderData = {
  environment: string;
  renderedAt: string;
  user: {
    name: string;
    email: string;
  };
};

export async function loader({
  context,
  request,
}: LoaderFunctionArgs): Promise<DashboardLoaderData> {
  const rrContextValue = context.get(rrContext);
  const session = requireAuthSession(rrContextValue.authSession, request);

  return {
    environment: rrContextValue.cfEnv.DOPPLER_ENVIRONMENT,
    renderedAt: new Date().toISOString(),
    user: {
      name: session.user.name,
      email: session.user.email,
    },
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
    <main className="min-h-screen max-w-[840px] px-7 py-12 sm:p-12">
      <nav className="mb-8 flex flex-wrap items-center gap-4">
        <Link className="text-gray-900" to="/">
          Home
        </Link>
        <a className="text-gray-900" href="/api/health">
          Health
        </a>
        <button
          className="cursor-pointer border-0 bg-transparent p-0 text-gray-900"
          disabled={isSigningOut}
          type="button"
          onClick={handleSignOut}
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-7">
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
          <button
            className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-semibold text-gray-900"
            type="button"
            onClick={() => setCount((value) => value + 1)}
          >
            Increment
          </button>
        </div>
      </section>
    </main>
  );
}
