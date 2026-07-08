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
    <main className="page page-narrow">
      <nav className="top-nav">
        <Link to="/">Home</Link>
        <a href="/health">Health</a>
      </nav>

      <section className="panel">
        <p className="eyebrow">Dashboard</p>
        <h1>SSR dashboard</h1>
        <p>
          Rendered in the Worker for <strong>{loaderData.environment}</strong>{" "}
          at{" "}
          <time dateTime={loaderData.renderedAt}>{loaderData.renderedAt}</time>.
        </p>

        <div className="counter">
          <span>Counter: {count}</span>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Increment
          </button>
        </div>
      </section>
    </main>
  );
}
