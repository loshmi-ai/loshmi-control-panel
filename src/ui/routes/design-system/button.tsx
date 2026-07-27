import type { ComponentProps } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { Button } from "@src/ui/components/designSystem/button";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";

const buttonSection: DesignSystemSection<ComponentProps<typeof Button>> = {
  component: "button",
  description: "Actions for forms, navigation, and destructive workflows.",
  examples: [
    {
      description: "The default action style for the main command in a view.",
      props: { children: "Save changes", variant: "primary" },
      title: "Primary",
    },
    {
      description: "A quieter action when the command is secondary.",
      props: { children: "Cancel", variant: "secondary" },
      title: "Secondary",
    },
    {
      description: "Use for destructive or high-risk actions.",
      props: { children: "Delete passkey", variant: "danger" },
      title: "Danger",
    },
    {
      description: "Disabled buttons preserve layout while blocking action.",
      props: { children: "Saving...", disabled: true, variant: "primary" },
      title: "Disabled",
    },
    {
      description: "Submit buttons should opt into native form submission.",
      props: {
        children: "Create account",
        type: "submit",
        variant: "primary",
      },
      title: "Submit",
    },
    {
      description: "Full-width buttons work inside narrow forms.",
      props: {
        children: "Continue",
        className: "w-full",
        variant: "secondary",
      },
      title: "Full width",
    },
  ],
  id: "button",
  path: "/design-system/button",
  previewClassName: "bg-neutral-950 text-white",
  title: "Button",
};

export function meta() {
  return [{ title: "Button | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

export default function DesignSystemButton({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={buttonSection.component}
        section={buttonSection}
        renderExample={(props) => <Button {...props} />}
      />
    </AppShell>
  );
}
