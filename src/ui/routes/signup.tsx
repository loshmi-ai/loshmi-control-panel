import { type FormEvent, useState } from "react";
import {
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
} from "react-router";

import { AnchorButton } from "@src/ui/components/anchor-button";
import { AppShell } from "@src/ui/components/app-shell";
import { Button } from "@src/ui/components/button";
import { Frame } from "@src/ui/components/frame";
import { Input } from "@src/ui/components/input";
import { authClient, safeRedirectTo } from "@src/ui/domain/auth";
import { getUser } from "@src/ui/domain/auth.server";

export function meta() {
  return [{ title: "Sign up | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  const user = getUser(args);

  if (user) {
    const url = new URL(args.request.url);
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
    <AppShell user={null}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6">
        <Frame
          borderVisible={true}
          className="w-full max-w-[420px] p-6 shadow-[0_22px_50px_rgba(0,0,0,0.28)] sm:p-7"
        >
          <h1 className="text-3xl leading-tight font-bold text-white">
            Create account
          </h1>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/82">
                Name
              </span>
              <Input required autoComplete="name" name="name" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/82">
                Email
              </span>
              <Input required autoComplete="email" name="email" type="email" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white/82">
                Password
              </span>
              <Input
                required
                autoComplete="new-password"
                name="password"
                type="password"
              />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <Button
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-white/62">Already have an account?</p>
            <AnchorButton
              className="w-full sm:ml-auto sm:w-auto"
              to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
              variant="secondary"
            >
              Log in
            </AnchorButton>
          </div>
        </Frame>
      </section>
    </AppShell>
  );
}
