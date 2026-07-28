import { Frame } from "@src/ui/components/frame";
import type { DesignSystemComponentPageProps } from "@src/ui/routes/design-system/components/component-page.types";
import { DesignSystemSidebar } from "@src/ui/routes/design-system/components/design-system-sidebar";

export function DesignSystemComponentPage<Props>({
  activeComponent,
  children,
  renderExample,
  section,
}: DesignSystemComponentPageProps<Props>) {
  const hasCustomContent = children !== undefined;
  const exampleGroups = section.exampleGroups ?? [
    {
      examples: section.examples ?? [],
      title: section.title,
    },
  ];
  const content =
    hasCustomContent || !renderExample ? (
      <div className="mt-8">{children}</div>
    ) : (
      <div className="mt-8 space-y-8">
        {exampleGroups.map((group) => (
          <section key={group.title}>
            {section.exampleGroups ? (
              <div className="mb-4">
                <h2 className="text-xl font-bold">{group.title}</h2>
                {group.description ? (
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/60">
                    {group.description}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {group.examples.map((example) => (
                <Frame borderVisible={true} className="p-4" key={example.title}>
                  <div className="mb-4">
                    <h3 className="font-semibold">{example.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {example.description}
                    </p>
                  </div>
                  <Frame
                    borderVisible={true}
                    className={`flex min-h-20 items-center p-4 ${section.previewClassName}`}
                  >
                    {renderExample(example.props)}
                  </Frame>
                </Frame>
              ))}
            </div>
          </section>
        ))}
      </div>
    );

  return (
    <div className="flex min-h-full flex-col gap-5 lg:flex-row">
      <DesignSystemSidebar activeComponent={activeComponent} />

      <section className="min-w-0 flex-1 pr-1">
        <div className="max-w-5xl pb-10">
          <p className="mb-3 text-[0.82rem] font-bold tracking-[0.08em] text-white/60 uppercase">
            Component
          </p>
          <h1 className="text-4xl leading-tight font-bold">{section.title}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
            {section.description}
          </p>

          {content}
        </div>
      </section>
    </div>
  );
}
