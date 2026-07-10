import {
  isRouteErrorResponse,
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type React from "react";

import stylesheet from "./global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "preload",
    href: "/fonts/MLMRoman12-Regular.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  // {
  //   rel: "preload",
  //   href: "/fonts/MLMRoman12-Bold.woff2",
  //   as: "font",
  //   type: "font/woff2",
  //   crossOrigin: "anonymous",
  // },
  // {
  //   rel: "preload",
  //   href: "/fonts/MLMRoman12-Italic.woff2",
  //   as: "font",
  //   type: "font/woff2",
  //   crossOrigin: "anonymous",
  // },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-0 bg-slate-50 font-sans text-gray-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.status === 404
        ? "The page you are looking for does not exist."
        : String(error.data);
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="min-h-screen max-w-[840px] px-7 py-12 sm:p-12">
      <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
        Loshmi Control Panel
      </p>
      <h1 className="max-w-[760px] text-4xl leading-[1.1] font-bold sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-base leading-relaxed text-slate-600">{message}</p>
    </main>
  );
}
