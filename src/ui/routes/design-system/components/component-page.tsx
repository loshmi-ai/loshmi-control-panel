import { Link } from "react-router";

import type { DesignSystemComponentLink } from "@src/ui/routes/design-system.types";
import type { DesignSystemComponentPageProps } from "@src/ui/routes/design-system/components/component-page.types";

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

export function DesignSystemComponentPage<Props>({
  activeComponent,
  renderExample,
  section,
}: DesignSystemComponentPageProps<Props>) {
  return (
    <div className="flex min-h-full flex-col gap-5 lg:flex-row">
      <aside className="shrink-0 border-b border-white/10 pb-4 lg:w-56 lg:border-r lg:border-b-0 lg:pr-5">
        <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-white/60 uppercase">
          Design System
        </p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          <Link
            className="rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-white/70 transition hover:bg-white/10 hover:text-white"
            to="/design-system"
          >
            Overview
          </Link>
          {designSystemComponentLinks.map((item) => (
            <Link
              className={
                item.id === activeComponent
                  ? "rounded-md bg-white/10 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white"
                  : "rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-white/70 transition hover:bg-white/10 hover:text-white"
              }
              key={item.id}
              to={item.path}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 pr-1">
        <div className="max-w-5xl pb-10">
          <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-white/60 uppercase">
            Component
          </p>
          <h1 className="text-4xl leading-tight font-bold">{section.title}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
            {section.description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {section.examples.map((example) => (
              <article
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                key={example.title}
              >
                <div className="mb-4">
                  <h2 className="font-semibold">{example.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {example.description}
                  </p>
                </div>
                <div
                  className={`flex min-h-20 items-center rounded-md border border-white/10 p-4 ${section.previewClassName}`}
                >
                  {renderExample(example.props)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
