import type { ComponentProps } from "react";
import { AtSign, Building2, Search, User } from "lucide-react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Input } from "@src/ui/components/input";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";

const inputSection: DesignSystemSection<ComponentProps<typeof Input>> = {
  component: "input",
  description: "Single-line text entry for auth, settings, and forms.",
  examples: [
    {
      description: "The baseline text field with a visible field label.",
      props: { defaultValue: "Loshmi", label: "Name", name: "name" },
      title: "Labeled Text",
    },
    {
      description: "Email fields keep browser autofill and validation hints.",
      props: {
        autoComplete: "email",
        defaultValue: "user@loshmi.dev",
        label: "Email",
        leftIcon: AtSign,
        name: "email",
        type: "email",
      },
      title: "Email",
    },
    {
      description: "Password fields include a built-in visibility toggle.",
      props: {
        autoComplete: "current-password",
        defaultValue: "not-a-real-password",
        label: "Password",
        name: "password",
        type: "password",
      },
      title: "Password",
    },
    {
      description: "Placeholder copy shows expected format without a value.",
      props: {
        label: "Workspace",
        leftIcon: Building2,
        name: "workspace",
        placeholder: "Workspace name",
      },
      title: "Placeholder",
    },
    {
      description: "Required fields carry native validation semantics.",
      props: {
        label: "Required email",
        name: "required-email",
        placeholder: "you@company.com",
        required: true,
        type: "email",
      },
      title: "Required",
    },
    {
      description: "Read-only fields can be selected but not changed.",
      props: {
        defaultValue: "readonly@loshmi.dev",
        label: "Read-only email",
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
        label: "Disabled field",
        disabled: true,
        name: "disabled-value",
      },
      title: "Disabled",
    },
    {
      description: "Error status highlights fields that need correction.",
      props: {
        defaultValue: "bad-email",
        errors: ["Enter a valid email address.", "Use your work email."],
        label: "Email",
        name: "error-email",
        type: "email",
      },
      title: "Error",
    },
    {
      description: "Non-password inputs can show trailing icons.",
      props: {
        label: "Search",
        name: "search",
        placeholder: "Search customers",
        rightIcon: Search,
      },
      title: "Right Icon",
    },
    {
      description: "Inputs can show both icon positions.",
      props: {
        defaultValue: "Aarav",
        label: "Customer",
        leftIcon: User,
        name: "customer",
        rightIcon: Search,
      },
      title: "Both Icons",
    },
  ],
  id: "input",
  path: "/design-system/input",
  previewClassName: "text-white",
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
