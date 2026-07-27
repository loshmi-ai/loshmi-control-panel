import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Table } from "@src/ui/components/designSystem/table";
import type { TableColumn } from "@src/ui/components/designSystem/table.types";
import { Variant, variants } from "@src/ui/components/designSystem/variants";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";

type VariantTokenRow = {
  description: string;
  name: string;
  value: Variant;
};

function getVariantTitle(variant: Variant) {
  return variant.charAt(0).toUpperCase() + variant.slice(1);
}

const variantDescriptions = {
  [Variant.Minimal]: "Lowest visual emphasis for quiet controls and inline UI.",
  [Variant.Outline]: "Outlined treatment for secondary surfaces and bounded controls.",
  [Variant.Primary]: "Highest visual emphasis for the main action in a workflow.",
  [Variant.Secondary]: "Medium visual emphasis for supporting actions and navigation.",
} satisfies Record<Variant, string>;

const variantRows = variants.map((variant) => ({
  description: variantDescriptions[variant],
  name: getVariantTitle(variant),
  value: variant,
}));

const variantColumns: TableColumn<VariantTokenRow>[] = [
  {
    header: "Name",
    id: "name",
    render: (row) => (
      <span className="text-base font-semibold text-white/90">{row.name}</span>
    ),
  },
  {
    header: "Value",
    id: "value",
    render: (row) => (
      <code className="font-mono text-sm font-semibold text-white/55">
        {row.value}
      </code>
    ),
  },
  {
    header: "Usage",
    id: "usage",
    render: (row) => (
      <span className="text-sm leading-relaxed text-white/60">
        {row.description}
      </span>
    ),
  },
];

const variantSection: DesignSystemSection<never> = {
  component: "variants",
  description: "Reusable visual emphasis levels for design-system controls.",
  id: "variants",
  path: "/design-system/variants",
  previewClassName: "bg-neutral-950 text-white",
  title: "Variants",
};

export function meta() {
  return [{ title: "Variants | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemVariants({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={variantSection.component}
        section={variantSection}
      >
        <Table
          columns={variantColumns}
          getRowKey={(row) => row.value}
          rows={variantRows}
        />
      </DesignSystemComponentPage>
    </AppShell>
  );
}
