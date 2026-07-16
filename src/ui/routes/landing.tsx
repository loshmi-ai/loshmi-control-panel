import { Link, type LoaderFunctionArgs } from "react-router";

import { rrContext } from "@src/ui/lib/rr-context";

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

type LandingLoaderData = {
  user: {
    name: string;
    email: string;
  } | null;
};

export async function loader({
  context,
}: LoaderFunctionArgs): Promise<LandingLoaderData> {
  const rrContextValue = context.get(rrContext);

  return {
    user: rrContextValue.authSession
      ? {
          name: rrContextValue.authSession.user.name,
          email: rrContextValue.authSession.user.email,
        }
      : null,
  };
}

export default function Landing({
  loaderData,
}: {
  loaderData: LandingLoaderData;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-14 sm:py-0">
      <article className="max-w-[620px]">
        <img src="/zygote.png" alt="" className="mb-6 w-20 md:-ml-6" />
        <h1 className="font-mlm-roman text-[2.5rem] leading-[1.15] sm:text-[clamp(2.25rem,6vw,3.75rem)]">
          High agency intelligence that achieves outcomes
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed sm:text-lg">
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
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 font-semibold">
          <a href="mailto:founders@metablocks.world">Join the waitlist.</a>
          {loaderData.user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span className="text-sm font-normal text-slate-600">
                {loaderData.user.name || loaderData.user.email}
              </span>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
