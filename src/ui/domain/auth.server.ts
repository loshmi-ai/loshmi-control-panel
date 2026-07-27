import { type LoaderFunctionArgs, redirect } from "react-router";

import { getRouteContext } from "@src/ui/lib/route-context.server";

export function getAuthCtx(args: LoaderFunctionArgs) {
  const authCtx = getRouteContext(args).authCtx;

  return authCtx;
}

export function getUser(args: LoaderFunctionArgs) {
  return getAuthCtx(args)?.user ?? null;
}

export function getAuthCtxOrRedirectToLogin(args: LoaderFunctionArgs) {
  const authCtx = getAuthCtx(args);

  if (!authCtx) {
    const url = new URL(args.request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return authCtx;
}

export function getUserOrRedirectToLogin(args: LoaderFunctionArgs) {
  return getAuthCtxOrRedirectToLogin(args).user;
}
