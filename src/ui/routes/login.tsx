import { type FormEvent, useEffect } from "react";
import {
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
} from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Button } from "@src/ui/components/button";
import { Frame } from "@src/ui/components/frame";
import { Input } from "@src/ui/components/input";
import { safeRedirectTo, useAuthActions } from "@src/ui/domain/auth";
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
  const auth = useAuthActions();
  const { clearAuthError, startConditionalPasskeySignIn } = auth;
  const redirectTo = safeRedirectTo(searchParams.get("redirectTo"));

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    void startConditionalPasskeySignIn({ redirectTo });
  }, [redirectTo, startConditionalPasskeySignIn]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    await auth.loginWithEmail({
      email,
      password,
      redirectTo,
    });
  }

  async function handlePasskeySignIn() {
    await auth.loginWithPasskey({ redirectTo });
  }

  return (
    <AppShell user={null}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6">
        <Frame borderVisible={true} className="w-full max-w-[420px] p-6 sm:p-7">
          <h1 className="text-3xl leading-tight font-bold text-white">
            Log in
          </h1>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <Input
              required
              autoComplete="email webauthn"
              label="Email"
              name="email"
              type="email"
            />
            <Input
              required
              autoComplete="current-password webauthn"
              label="Password"
              name="password"
              type="password"
            />
            {auth.error ? (
              <p className="text-sm text-red-700">{auth.error}</p>
            ) : null}
            <Button
              className="w-full"
              disabled={auth.isLoggingIn}
              loading={auth.isLoggingIn}
              sound={CuelumeSound.Chime}
              type="submit"
            >
              {auth.isLoggingIn ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-white/45 uppercase">
            <span className="h-px flex-1 bg-white/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <Button
            className="w-full"
            disabled={auth.isLoggingIn || auth.isSigningInWithPasskey}
            loading={auth.isSigningInWithPasskey}
            sound={CuelumeSound.Success}
            variant="outline"
            onClick={handlePasskeySignIn}
          >
            {auth.isSigningInWithPasskey
              ? "Signing in..."
              : "Sign in with passkey"}
          </Button>
        </Frame>
      </section>
    </AppShell>
  );
}
