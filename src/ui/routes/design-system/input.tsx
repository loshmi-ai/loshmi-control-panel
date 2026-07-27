import type { ComponentProps } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Input } from "@src/ui/components/designSystem/input";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";

const inputSection: DesignSystemSection<ComponentProps<typeof Input>> = {
  component: "input",
  description: "Single-line text entry for auth, settings, and forms.",
  examples: [
    {
      description: "The baseline text field for short values.",
      props: { defaultValue: "Loshmi", name: "name" },
      title: "Text",
    },
    {
      description: "Email fields keep browser autofill and validation hints.",
      props: {
        autoComplete: "email",
        defaultValue: "user@loshmi.dev",
        name: "email",
        type: "email",
      },
      title: "Email",
    },
    {
      description: "Password fields use the native masked input type.",
      props: {
        autoComplete: "current-password",
        defaultValue: "not-a-real-password",
        name: "password",
        type: "password",
      },
      title: "Password",
    },
    {
      description: "Placeholder copy shows expected format without a value.",
      props: { name: "workspace", placeholder: "Workspace name" },
      title: "Placeholder",
    },
    {
      description: "Required fields carry native validation semantics.",
      props: {
        name: "required-email",
        placeholder: "Required email",
        required: true,
        type: "email",
      },
      title: "Required",
    },
    {
      description: "Read-only fields can be selected but not changed.",
      props: {
        defaultValue: "readonly@loshmi.dev",
        name: "readonly-email",
        readOnly: true,
        type: "email",
      },
      title: "Read-only",
    },
    {
      description: "Disabled fields are unavailable to the workflow.",
      props: {
        defaultValue: "Disabled value",
        disabled: true,
        name: "disabled-value",
      },
      title: "Disabled",
    },
    {
      description: "Error status highlights fields that need correction.",
      props: {
        defaultValue: "bad-email",
        name: "error-email",
        status: "error",
        type: "email",
      },
      title: "Error",
    },
  ],
  id: "input",
  path: "/design-system/input",
  previewClassName: "bg-white text-gray-950",
  title: "Input",
};

export function meta() {
  return [{ title: "Input | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemInput({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={inputSection.component}
        section={inputSection}
        renderExample={(props) => <Input {...props} />}
      />
    </AppShell>
  );
}
