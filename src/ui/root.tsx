import { AutumnProvider } from "autumn-js/react";
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

import { AppShell } from "@src/ui/components/app-shell";
import { Frame } from "@src/ui/components/frame";
import { CuelumeBinding } from "@src/ui/lib/cuelume";

import "./global.css";

export const links = () => [
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
] satisfies ReturnType<LinksFunction>;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-0 bg-background font-sans text-foreground antialiased">
        <AutumnProvider>{children}</AutumnProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <CuelumeBinding />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let title = "Something went wrong";
  let message = "Something went wrong while loading this page.";
  let status: number | null = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;

    if (error.status === 404) {
      title = "Page not found";
      message = "The page you are looking for does not exist.";
    }
  } else if (error instanceof Error) {
    status = null;
  }

  return (
    <AppShell user={null}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6">
        <Frame
          borderVisible={true}
          className="w-full max-w-[460px] p-6 sm:p-7"
        >
          {status ? (
            <p className="mb-3 text-[0.78rem] font-bold tracking-[0.08em] text-foreground/50 uppercase">
              Error {status}
            </p>
          ) : null}
          <h1 className="text-3xl leading-tight font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {message}
          </p>
        </Frame>
      </section>
    </AppShell>
  );
}
