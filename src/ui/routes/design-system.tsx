import { type LoaderFunctionArgs } from "react-router";
import { Link } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import type { DesignSystemComponentLink } from "@src/ui/routes/design-system.types";

const designSystemComponentLinks = [
  {
    description: "Actions for forms, navigation, and destructive workflows.",
    id: "button",
    path: "/design-system/button",
    title: "Button",
  },
  {
    description: "Single-line text entry for auth, settings, and forms.",
    id: "input",
    path: "/design-system/input",
    title: "Input",
  },
] satisfies DesignSystemComponentLink[];

const designSystemFoundations = {
  colors: [
    {
      className: "bg-neutral-950",
      description: "Outer app shell and button preview surface.",
      name: "Neutral 950",
      token: "neutral-950",
    },
    {
      className: "bg-neutral-900",
      description: "Primary authenticated app panel.",
      name: "Neutral 900",
      token: "neutral-900",
    },
    {
      className: "bg-white",
      description: "Form fields and light preview surfaces.",
      name: "White",
      token: "white",
    },
    {
      className: "bg-slate-50",
      description: "Global page background and read-only field fill.",
      name: "Slate 50",
      token: "slate-50",
    },
    {
      className: "bg-slate-300",
      description: "Input borders and disabled primary controls.",
      name: "Slate 300",
      token: "slate-300",
    },
    {
      className: "bg-gray-950",
      description: "Primary foreground and strong control borders.",
      name: "Gray 950",
      token: "gray-950",
    },
    {
      className: "bg-red-700",
      description: "Danger and error text.",
      name: "Red 700",
      token: "red-700",
    },
    {
      className: "bg-indigo-600",
      description: "Brand eyebrow text on unauthenticated screens.",
      name: "Indigo 600",
      token: "indigo-600",
    },
  ],
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
            <Link
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white"
              to="/design-system"
            >
              Overview
            </Link>
            {designSystemComponentLinks.map((section) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-white/70 transition hover:bg-white/10 hover:text-white"
                key={section.id}
                to={section.path}
              >
                {section.title}
              </Link>
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
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
                      key={section.id}
                      to={section.path}
                    >
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {section.description}
                      </p>
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
                    <article
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                      key={font.name}
                    >
                      <p className="text-xs font-bold tracking-[0.08em] text-white/45 uppercase">
                        {font.token}
                      </p>
                      <p className={`mt-3 ${font.className}`}>{font.sample}</p>
                      <h3 className="mt-4 font-semibold">{font.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {font.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Colors</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    Core color tokens used by the shell, forms, and controls.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {designSystemFoundations.colors.map((color) => (
                    <article
                      className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
                      key={color.token}
                    >
                      <div className={`h-20 ${color.className}`} />
                      <div className="p-4">
                        <h3 className="font-semibold">{color.name}</h3>
                        <p className="mt-1 text-xs font-bold tracking-[0.08em] text-white/45 uppercase">
                          {color.token}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">
                          {color.description}
                        </p>
                      </div>
                    </article>
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
