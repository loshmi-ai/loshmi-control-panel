import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Intent, intents } from "@src/ui/components/designSystem/intents";
import { Table } from "@src/ui/components/designSystem/table";
import type { TableColumn } from "@src/ui/components/designSystem/table.types";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";

type IntentTokenRow = {
  description: string;
  name: string;
  value: Intent;
};

function getIntentTitle(value: Intent) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const intentDescriptions = {
  [Intent.Danger]: "Semantic tone for destructive, irreversible, or high-risk actions.",
  [Intent.Normal]: "Default semantic tone for standard actions, controls, and states.",
} satisfies Record<Intent, string>;

const intentRows = intents.map((intent) => ({
  description: intentDescriptions[intent],
  name: getIntentTitle(intent),
  value: intent,
}));

const intentColumns: TableColumn<IntentTokenRow>[] = [
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

const intentSection: DesignSystemSection<never> = {
  component: "intents",
  description: "Reusable semantic tone for normal and dangerous actions.",
  id: "intents",
  path: "/design-system/intents",
  previewClassName: "bg-neutral-950 text-white",
  title: "Intents",
};

export function meta() {
  return [{ title: "Intents | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemIntents({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={intentSection.component}
        section={intentSection}
      >
        <Table
          columns={intentColumns}
          getRowKey={(row) => row.value}
          rows={intentRows}
        />
      </DesignSystemComponentPage>
    </AppShell>
  );
}
