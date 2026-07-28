import { Link, type LoaderFunctionArgs } from "react-router";

import { PublicShell } from "@src/ui/components/designSystem/public-shell";
import { getUser } from "@src/ui/domain/auth.server";
import type { LandingLoaderData } from "@src/ui/routes/landing.types";

export function meta() {
  return [
    { title: "Loshmi" },
    {
      name: "description",
      content:
        "High agency intelligence that achieves outcomes — Loshmi gives a full VPS with root access to every agent.",
    },
  ];
}

export async function loader(
  args: LoaderFunctionArgs,
): Promise<LandingLoaderData> {
  const user = getUser(args);

  return {
    user,
  };
}

export default function Landing({
  loaderData,
}: {
  loaderData: LandingLoaderData;
}) {
  return (
    <PublicShell user={loaderData.user}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6 sm:py-0">
        <article className="max-w-[620px]">
          <img
            src="/loshmi-cat.svg"
            alt="Loshmi Cat Logo"
            className="mb-1 w-20 md:-ml-6"
          />
          <h1 className="font-mlm-roman text-[2.5rem] leading-[1.15] text-white sm:text-[clamp(2.25rem,6vw,3.75rem)]">
            High agency intelligence that achieves outcomes
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/72 sm:text-lg">
            <p>
              LLMs and AI Agents have fundamentally changed how we work. From
              developing apps, to researching markets. From making videos to
              publishing research.
            </p>
            <p>
              Harnesses like Claude Code and Codex, help control your computer.
              But in essence, they are limited and pose a security risk. Your
              computer and the agent's computer should not fight for resources.
            </p>
            <p>
              Loshmi gives a full VPS with root access to every agent. Our
              tasteful harness connects to your email, holds your card securely,
              and can take actions on your behalf.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 font-semibold text-white">
            <a
              className="text-white/90"
              href="mailto:founders@metablocks.world"
            >
              Join the waitlist.
            </a>
            {loaderData.user ? (
              <>
                <Link className="text-white/90" to="/dashboard">
                  Dashboard
                </Link>
                <span className="text-sm font-normal text-white/60">
                  {loaderData.user.name || loaderData.user.email}
                </span>
              </>
            ) : (
              <Link className="text-white/90" to="/login">
                Log in
              </Link>
            )}
          </div>
        </article>
      </section>
    </PublicShell>
  );
}
