import { useState, type FormEvent } from "react";
import {
  Link,
  redirect,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";

import { cloudflareContext } from "@src/backend/react-router-context";
import { getSessionFromRequest } from "@src/lib/auth";
import { authClient } from "@src/ui/auth-client";
import { safeRedirectTo } from "@src/ui/auth-redirect";

export function meta() {
  return [{ title: "Sign up | Loshmi Control Panel" }];
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const cloudflare = context.get(cloudflareContext);
  const session = await getSessionFromRequest(cloudflare.env, request);

  if (session) {
    const url = new URL(request.url);
    throw redirect(safeRedirectTo(url.searchParams.get("redirectTo")));
  }

  return null;
}

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = safeRedirectTo(searchParams.get("redirectTo"));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: redirectTo,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Could not create your account.");
      return;
    }

    window.location.assign(redirectTo);
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="w-full max-w-[420px] rounded-lg border border-slate-200 bg-white p-7">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-indigo-600 uppercase">
          Loshmi
        </p>
        <h1 className="text-3xl leading-tight font-bold">Create account</h1>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              required
              autoComplete="name"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base"
              name="name"
              type="text"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              required
              autoComplete="email"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base"
              name="email"
              type="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              required
              autoComplete="new-password"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base"
              minLength={8}
              name="password"
              type="password"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md bg-gray-950 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-semibold text-gray-950"
            to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          >
            Log in.
          </Link>
        </p>
      </section>
    </main>
  );
}
