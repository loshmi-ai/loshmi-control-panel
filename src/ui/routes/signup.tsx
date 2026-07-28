import { type FormEvent, useState } from "react";
import {
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
} from "react-router";

import { AnchorButton, Button } from "@src/ui/components/designSystem/button";
import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Input } from "@src/ui/components/designSystem/input";
import { Variant } from "@src/ui/components/designSystem/variants";
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
        <article className="w-full max-w-[420px] rounded-lg border border-white/10 bg-neutral-950/78 p-6 shadow-[0_22px_50px_rgba(0,0,0,0.28)] sm:p-7">
          <h1 className="text-3xl leading-tight font-bold text-white">
            Create account
          </h1>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <Input required autoComplete="name" label="Name" name="name" />
            <Input
              required
              autoComplete="email"
              label="Email"
              name="email"
              type="email"
            />
            <Input
              required
              autoComplete="new-password"
              label="Password"
              minLength={8}
              name="password"
              type="password"
            />
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <Button className="w-full" loading={isSubmitting} type="submit">
              Create account
            </Button>
          </form>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-white/62">Already have an account?</p>
            <AnchorButton
              className="w-full sm:ml-auto sm:w-auto"
              to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
              variant={Variant.Secondary}
            >
              Log in
            </AnchorButton>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
