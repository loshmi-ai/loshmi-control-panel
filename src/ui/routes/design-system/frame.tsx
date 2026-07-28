import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Frame } from "@src/ui/components/frame";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";

const frameSection: DesignSystemSection<never> = {
  component: "frame",
  description: "Contrast surfaces for grouped UI and preview containers.",
  id: "frame",
  path: "/design-system/frame",
  previewClassName: "text-white",
  title: "Frame",
};

const frameExamples = [
  {
    borderVisible: false,
    description: "Default surface with a transparent stable border.",
    standout: false,
    title: "Normal, Border Hidden",
  },
  {
    borderVisible: true,
    description: "Default surface with the standard visible border.",
    standout: false,
    title: "Normal, Border Visible",
  },
  {
    borderVisible: false,
    description: "Raised contrast surface with a transparent stable border.",
    standout: true,
    title: "Standout, Border Hidden",
  },
  {
    borderVisible: true,
    description: "Raised contrast surface with the stronger visible border.",
    standout: true,
    title: "Standout, Border Visible",
  },
] as const;

export function meta() {
  return [{ title: "Frame | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemFrame({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={frameSection.component}
        section={frameSection}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {frameExamples.map((example) => (
            <section key={example.title}>
              <h2 className="font-semibold">{example.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                {example.description}
              </p>
              <Frame
                borderVisible={example.borderVisible}
                className="mt-4 min-h-28 p-4"
                standout={example.standout}
              >
                <p className="text-sm font-semibold text-white/85">
                  Preview surface
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/58">
                  Padding and layout come from the caller; the frame supplies
                  radius, background, and stable border treatment.
                </p>
              </Frame>
            </section>
          ))}
        </div>
      </DesignSystemComponentPage>
    </AppShell>
  );
}
