import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import type { LinkProps } from "react-router";

import type { Intent } from "@src/ui/components/designSystem/intents";
import type { Variant } from "@src/ui/components/designSystem/variants";

type ButtonStyleProps = {
  intent?: Intent;
  leftIcon?: LucideIcon;
  loading?: boolean;
  rightIcon?: LucideIcon;
  variant?: Variant;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps;

export type AnchorButtonProps = LinkProps & ButtonStyleProps;
