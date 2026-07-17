import { type FormEvent, useEffect, useState } from "react";
import {
  Link,
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
} from "react-router";

import { rrContext } from "@src/api/lib/rr-context";
import { authClient, safeRedirectTo } from "@src/ui/lib/auth";

export function meta() {
  return [{ title: "Log in | Loshmi Control Panel" }];
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const rrContextValue = context.get(rrContext);

  if (rrContextValue.authSession) {
    const url = new URL(request.url);
    throw redirect(safeRedirectTo(url.searchParams.get("redirectTo")));
  }

  return null;
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasskeySubmitting, setIsPasskeySubmitting] = useState(false);
  const redirectTo = safeRedirectTo(searchParams.get("redirectTo"));

  useEffect(() => {
    async function startConditionalPasskeySignIn() {
      if (
        typeof PublicKeyCredential === "undefined" ||
        !PublicKeyCredential.isConditionalMediationAvailable
      ) {
        return;
      }

      const isAvailable =
        await PublicKeyCredential.isConditionalMediationAvailable();

      if (!isAvailable) {
        return;
      }

      const result = await authClient.signIn.passkey({ autoFill: true });

      if (result.error) {
        return;
      }

      window.location.assign(redirectTo);
    }

    void startConditionalPasskeySignIn();
  }, [redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: redirectTo,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Could not log in.");
      return;
    }

    window.location.assign(redirectTo);
  }

  async function handlePasskeySignIn() {
    setError(null);
    setIsPasskeySubmitting(true);

    const result = await authClient.signIn.passkey();

    setIsPasskeySubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Could not log in with passkey.");
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
        <h1 className="text-3xl leading-tight font-bold">Log in</h1>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              required
              autoComplete="email webauthn"
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
              autoComplete="current-password webauthn"
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
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-4 font-semibold text-gray-950 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          disabled={isSubmitting || isPasskeySubmitting}
          type="button"
          onClick={handlePasskeySignIn}
        >
          {isPasskeySubmitting ? "Checking passkey..." : "Sign in with passkey"}
        </button>
        <p className="mt-6 text-sm text-slate-600">
          New here?{" "}
          <Link
            className="font-semibold text-gray-950"
            to={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
          >
            Create an account.
          </Link>
        </p>
      </section>
    </main>
  );
}
