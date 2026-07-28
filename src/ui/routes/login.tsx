import { type FormEvent, useEffect, useState } from "react";
import {
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
} from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Button } from "@src/ui/components/button";
import { Frame } from "@src/ui/components/frame";
import { Input } from "@src/ui/components/input";
import { authClient, safeRedirectTo } from "@src/ui/domain/auth";
import { getUser } from "@src/ui/domain/auth.server";
import { CuelumeSound } from "@src/ui/lib/cuelume";

export function meta() {
  return [{ title: "Log in | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  const user = getUser(args);

  if (user) {
    const url = new URL(args.request.url);
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
    <AppShell user={null}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6">
        <Frame borderVisible={true} className="w-full max-w-[420px] p-6 sm:p-7">
          <h1 className="text-3xl leading-tight font-bold text-white">
            Log in
          </h1>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/82">
                Email
              </span>
              <Input
                required
                autoComplete="email webauthn"
                name="email"
                type="email"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/82">
                Password
              </span>
              <Input
                required
                autoComplete="current-password webauthn"
                name="password"
                type="password"
              />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <Button
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
              sound={CuelumeSound.Chime}
              type="submit"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-white/45 uppercase">
            <span className="h-px flex-1 bg-white/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <Button
            className="w-full"
            disabled={isSubmitting || isPasskeySubmitting}
            loading={isPasskeySubmitting}
            sound={CuelumeSound.Success}
            variant="outline"
            onClick={handlePasskeySignIn}
          >
            {isPasskeySubmitting ? "Signing in..." : "Sign in with passkey"}
          </Button>
        </Frame>
      </section>
    </AppShell>
  );
}
