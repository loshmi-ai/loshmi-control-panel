import { useState } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";

import { cloudflareContext } from "@src/backend/react-router-context";

export function meta() {
  return [{ title: "Dashboard | Loshmi Control Panel" }];
}

type DashboardLoaderData = {
  environment: string;
  renderedAt: string;
};

export function loader({ context }: LoaderFunctionArgs): DashboardLoaderData {
  const cloudflare = context.get(cloudflareContext);

  return {
    environment: cloudflare.env.DOPPLER_ENVIRONMENT,
    renderedAt: new Date().toISOString(),
  };
}

export default function Dashboard({
  loaderData,
}: {
  loaderData: DashboardLoaderData;
}) {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen max-w-[840px] px-7 py-12 sm:p-12">
      <nav className="mb-8 flex gap-4">
        <Link className="text-gray-900" to="/">
          Home
        </Link>
        <a className="text-gray-900" href="/health">
          Health
        </a>
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-7">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Dashboard
        </p>
        <h1 className="text-4xl leading-tight font-bold">SSR dashboard</h1>
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
