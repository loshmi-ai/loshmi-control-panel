import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { getUser } from "@src/ui/domain/auth.server";
import type { LandingLoaderData } from "@src/ui/routes/landing.types";

export function meta() {
  return [
    { title: "Loshmi" },
    {
      name: "description",
      content:
        "Always-on agents that notice, propose, and act. Loshmi is a computer for an agent, connected to the accounts and tools your work depends on.",
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
    <AppShell user={loaderData.user}>
      <section className="grid min-h-full place-items-center px-4 py-12 sm:px-6 sm:py-0">
        <article className="max-w-[620px]">
          <img
            src="/loshmi-cat.svg"
            alt="Loshmi Cat Logo"
            className="mb-1 w-20 md:-ml-6"
          />
          <h1 className="font-mlm-roman text-[2.5rem] leading-[1.15] text-white sm:text-[clamp(2.25rem,6vw,3.75rem)]">
            Always-on agents that notice, propose, and act
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/72 sm:text-lg">
            <p>
              Claude, Codex, and other AI agents have already changed how we
              work. They help us think faster, write better, build software,
              analyze information, and move from idea to execution with far less
              friction.
            </p>
            <p>
              But today, most agents still wait for you to begin. You give them
              a prompt, explain the context, describe the task, and then they
              assist. Loshmi connects your agent to the signals you already
              receive, so it can notice what needs attention, understand your
              process, propose the right next step, and take action when you
              allow it to.
            </p>
            <p>
              Loshmi is a computer for an agent. It is always online, has its
              own domain and email, and connects to the accounts and tools your
              work depends on. You can teach it how you operate, train it on
              your processes, and let it handle work without waiting for a prompt
              every time. When something needs judgment, approval, or a final
              call, it asks for your permission.
            </p>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
