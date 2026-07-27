import type { LucideIcon } from "lucide-react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/designSystem/app-shell";
import { AnchorButton, Button } from "@src/ui/components/designSystem/button";
import { Intent, intents } from "@src/ui/components/designSystem/intents";
import { Variant } from "@src/ui/components/designSystem/variants";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import type {
  DesignSystemExample,
  DesignSystemSection,
} from "@src/ui/routes/design-system.types";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";

type ButtonExampleProps = {
  children: string;
  className?: string;
  disabled?: boolean;
  intent?: Intent;
  leftIcon?: LucideIcon;
  loading?: boolean;
  rightIcon?: LucideIcon;
  to?: string;
  type?: "button" | "submit";
  variant?: Variant;
};

const buttonVariants = [
  Variant.Primary,
  Variant.Secondary,
  Variant.Minimal,
  Variant.Outline,
];

function getTitle(value: Intent | Variant) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getButtonExamples({
  disabled = false,
  includeIntentInTitle = false,
}: {
  disabled?: boolean;
  includeIntentInTitle?: boolean;
} = {}): DesignSystemExample<ButtonExampleProps>[] {
  return intents.flatMap((intent) =>
    buttonVariants.map((variant) => {
      const intentTitle = getTitle(intent);
      const variantTitle = getTitle(variant);
      const title = includeIntentInTitle
        ? `${intentTitle} ${variantTitle}`
        : variantTitle;

      return {
        description: `${title} button${disabled ? " in disabled state" : ""}.`,
        props: {
          children: title,
          disabled,
          intent,
          variant,
        },
        title,
      };
    }),
  );
}

const buttonSection: DesignSystemSection<ButtonExampleProps> = {
  component: "button",
  description: "Actions for forms, navigation, and destructive workflows.",
  exampleGroups: [
    {
      description: "Primary, secondary, minimal, and outline button variants.",
      examples: buttonVariants.map((variant) => {
        const title = getTitle(variant);

        return {
          description: `${title} button with normal intent.`,
          props: {
            children: title,
            intent: Intent.Normal,
            variant,
          },
          title,
        };
      }),
      title: "All Button Types",
    },
    {
      description: "Every button variant shown with normal and danger intent.",
      examples: getButtonExamples({ includeIntentInTitle: true }),
      title: "Normal And Danger Intents",
    },
    {
      description: "Every button variant and intent shown while disabled.",
      examples: getButtonExamples({
        disabled: true,
        includeIntentInTitle: true,
      }),
      title: "Disabled Buttons",
    },
    {
      description: "Every button variant shown while an action is in progress.",
      examples: getButtonExamples({ includeIntentInTitle: true }).map(
        (example) => ({
          ...example,
          description: `${example.title} button in loading state.`,
          props: {
            ...example.props,
            loading: true,
          },
        }),
      ),
      title: "Loading Buttons",
    },
    {
      description: "Buttons with leading and trailing Lucide icons.",
      examples: [
        {
          description: "Primary button with a leading icon.",
          props: {
            children: "Create",
            intent: Intent.Normal,
            leftIcon: Plus,
            variant: Variant.Primary,
          },
          title: "Left Icon",
        },
        {
          description: "Anchor button with a trailing icon.",
          props: {
            children: "Open Billing",
            intent: Intent.Normal,
            rightIcon: ArrowRight,
            to: "/billing",
            variant: Variant.Secondary,
          },
          title: "Right Icon",
        },
        {
          description: "Danger button with both icon positions populated.",
          props: {
            children: "Delete",
            intent: Intent.Danger,
            leftIcon: Trash2,
            rightIcon: ArrowRight,
            variant: Variant.Outline,
          },
          title: "Both Icons",
        },
      ],
      title: "Icon Buttons",
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
        renderExample={({ to, ...props }) =>
          to ? <AnchorButton to={to} {...props} /> : <Button {...props} />
        }
      />
    </AppShell>
  );
}
