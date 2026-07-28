import { type LoaderFunctionArgs } from "react-router";
import { Link } from "react-router";

import { AnchorButton } from "@src/ui/components/anchor-button";
import { AppShell } from "@src/ui/components/app-shell";
import { Frame } from "@src/ui/components/frame";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { designSystemComponentLinks } from "@src/ui/routes/design-system/navigation";

const designSystemFoundations = {
  fonts: [
    {
      className: "font-sans",
      description: "System sans stack used for the application interface.",
      name: "Sans",
      sample: "Loshmi Control Panel",
      token: "font-sans",
    },
    {
      className: "font-mlm-roman",
      description: "MLMRoman regular face loaded from the public font files.",
      name: "MLMRoman",
      sample: "Loshmi Control Panel",
      token: "font-mlm-roman",
    },
    {
      className: "text-sm font-semibold",
      description: "Compact labels, navigation, and control text.",
      name: "Small Semibold",
      sample: "Settings",
      token: "text-sm font-semibold",
    },
    {
      className: "text-4xl font-bold",
      description: "Authenticated route page titles.",
      name: "Page Title",
      sample: "Design System",
      token: "text-4xl font-bold",
    },
  ],
};

export function meta() {
  return [{ title: "Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystem({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <div className="flex min-h-full flex-col gap-5 lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 pb-4 lg:w-56 lg:border-r lg:border-b-0 lg:pr-5">
          <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-white/60 uppercase">
            Design System
          </p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            <AnchorButton
              className="font-normal"
              to="/design-system"
              variant="ghost"
            >
              Overview
            </AnchorButton>
            {designSystemComponentLinks.map((section) => (
              <AnchorButton
                className="font-normal"
                key={section.id}
                to={section.path}
                variant="ghost"
              >
                {section.title}
              </AnchorButton>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 pr-1">
          <div className="max-w-5xl pb-10">
            <h1 className="text-4xl leading-tight font-bold">Design System</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
              A working reference for Loshmi interface foundations and reusable
              components.
            </p>

            <div className="mt-8 space-y-10">
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Components</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    Each component has its own route with data-driven examples.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {designSystemComponentLinks.map((section) => (
                    <Link
                      className="group rounded-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                      key={section.id}
                      to={section.path}
                    >
                      <Frame
                        borderVisible={true}
                        className="h-full p-4"
                      >
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                          {section.description}
                        </p>
                      </Frame>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Fonts</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    Text styles currently exposed through Tailwind theme tokens.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {designSystemFoundations.fonts.map((font) => (
                    <Frame borderVisible={true} className="p-4" key={font.name}>
                      <p className="text-xs font-bold tracking-[0.08em] text-white/45 uppercase">
                        {font.token}
                      </p>
                      <p className={`mt-3 ${font.className}`}>{font.sample}</p>
                      <h3 className="mt-4 font-semibold">{font.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {font.description}
                      </p>
                    </Frame>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
