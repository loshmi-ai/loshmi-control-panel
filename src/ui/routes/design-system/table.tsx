import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Table } from "@src/ui/components/designSystem/table";
import type { TableColumn } from "@src/ui/components/designSystem/table.types";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";

type TableExampleRow = {
  created: string;
  group: string;
  id: string;
  name: string;
};

const tableColumns: TableColumn<TableExampleRow>[] = [
  {
    header: "Name",
    id: "name",
    render: (row) => (
      <span className="text-base font-semibold text-white/90">{row.name}</span>
    ),
  },
  {
    header: "ID",
    id: "id",
    render: (row) => (
      <code className="font-mono text-sm font-semibold text-white/55">
        {row.id}
      </code>
    ),
  },
  {
    header: "Group",
    id: "group",
    render: (row) => (
      <span className="text-base font-semibold text-white/90">{row.group}</span>
    ),
  },
  {
    header: "Created",
    id: "created",
    render: (row) => (
      <span className="text-sm font-semibold text-white/45">
        {row.created}
      </span>
    ),
  },
];

const tableRows: TableExampleRow[] = [
  {
    created: "26 Jul",
    group: "loshmi-main",
    id: "loshmi_one_byok",
    name: "Loshmi One BYOK",
  },
  {
    created: "17 Jul",
    group: "loshmi-main",
    id: "loshmi_one",
    name: "Loshmi One",
  },
];

const tableSection: DesignSystemSection<never> = {
  component: "table",
  description: "Structured data display for dense administrative views.",
  id: "table",
  path: "/design-system/table",
  previewClassName: "bg-neutral-950 text-white",
  title: "Table",
};

export function meta() {
  return [{ title: "Table | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemTable({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={tableSection.component}
        section={tableSection}
      >
        <Table
          columns={tableColumns}
          getRowKey={(row) => row.id}
          rows={tableRows}
        />
      </DesignSystemComponentPage>
    </AppShell>
  );
}
