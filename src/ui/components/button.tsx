import clsx from "clsx";
import { Loader } from "lucide-react";
import { Link } from "react-router";

import type {
  AnchorButtonProps,
  ButtonProps,
} from "@src/ui/components/button.types";
import { Intent } from "@src/ui/components/intents";
import { Variant } from "@src/ui/components/variants";

const baseButtonClassName =
  "relative inline-flex min-h-8 items-center justify-center gap-2 rounded-full px-3.5 text-sm font-medium shadow-sm transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none";

const enabledButtonClassName = "cursor-pointer active:shadow-none";

const disabledButtonClassName =
  "cursor-not-allowed opacity-45 shadow-none";

const loadingButtonClassName = "cursor-wait opacity-45 shadow-none";

const variantClassNames: Record<
  Variant,
  Record<Intent, { base: string; enabled: string }>
> = {
  [Variant.Primary]: {
    [Intent.Normal]: {
      base: "border border-transparent bg-emerald-900 text-white shadow-[0_10px_22px_rgba(6,78,59,0.3),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_0_1px_rgba(255,255,255,0.14)]",
      enabled: "hover:bg-emerald-800",
    },
    [Intent.Danger]: {
      base: "border border-transparent bg-red-950 text-white shadow-[0_10px_22px_rgba(69,10,10,0.28),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.12)]",
      enabled: "hover:bg-red-900",
    },
  },
  [Variant.Secondary]: {
    [Intent.Normal]: {
      base: "border border-white/20 bg-white/14 text-white shadow-[0_10px_22px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]",
      enabled: "hover:border-white/30 hover:bg-white/20",
    },
    [Intent.Danger]: {
      base: "border border-red-200/25 bg-white/12 text-red-200 shadow-[0_10px_22px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.16)]",
      enabled: "hover:bg-red-400/12",
    },
  },
  [Variant.Outline]: {
    [Intent.Normal]: {
      base: "border border-white/22 bg-transparent text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)]",
      enabled: "hover:border-white/38 hover:bg-white/8",
    },
    [Intent.Danger]: {
      base: "border border-red-300/42 bg-transparent text-red-200 shadow-[0_8px_18px_rgba(0,0,0,0.14)]",
      enabled: "hover:bg-red-400/10",
    },
  },
  [Variant.Minimal]: {
    [Intent.Normal]: {
      base: "border border-transparent bg-transparent text-white shadow-none",
      enabled: "hover:bg-white/9 hover:shadow-none",
    },
    [Intent.Danger]: {
      base: "border border-transparent bg-transparent text-red-200 shadow-none",
      enabled: "hover:bg-red-400/10 hover:shadow-none",
    },
  },
};

function getButtonClassName({
  className,
  disabled,
  intent = Intent.Normal,
  loading,
  variant = Variant.Primary,
}: {
  className?: string;
  disabled?: boolean;
  intent?: Intent;
  loading?: boolean;
  variant?: Variant;
}) {
  const buttonVariantClassNames = variantClassNames[variant][intent];
  const isInteractive = !disabled && !loading;

  return clsx(
    baseButtonClassName,
    buttonVariantClassNames.base,
    {
      [enabledButtonClassName]: isInteractive,
      [buttonVariantClassNames.enabled]: isInteractive,
    },
    {
      [disabledButtonClassName]: disabled,
      [loadingButtonClassName]: loading && !disabled,
    },
    className,
  );
}

function ButtonContent({
  children,
  leftIcon,
  loading,
  rightIcon: RightIcon,
}: Pick<ButtonProps, "children" | "leftIcon" | "loading" | "rightIcon">) {
  const LeftIcon = loading ? Loader : leftIcon;

  return (
    <>
      {LeftIcon ? (
        <LeftIcon
          aria-hidden="true"
          className={clsx("shrink-0", loading && "button-loading-spinner")}
          size={16}
          strokeWidth={2.25}
        />
      ) : null}
      {children}
      {RightIcon ? (
        <RightIcon
          aria-hidden="true"
          className="shrink-0"
          size={16}
          strokeWidth={2.25}
        />
      ) : null}
    </>
  );
}

export function Button({
  children,
  className,
  disabled,
  intent = Intent.Normal,
  leftIcon,
  loading,
  rightIcon,
  type = "button",
  variant = Variant.Primary,
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      data-cuelume-press={disabled || loading ? undefined : ""}
      className={getButtonClassName({
        className,
        disabled,
        intent,
        loading,
        variant,
      })}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      <ButtonContent
        leftIcon={leftIcon}
        loading={loading}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    </button>
  );
}

export function AnchorButton({
  children,
  className,
  intent = Intent.Normal,
  leftIcon,
  loading,
  variant = Variant.Primary,
  onClick,
  rightIcon,
  tabIndex,
  ...props
}: AnchorButtonProps) {
  const isDisabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const isBlocked = isDisabled || loading;

  return (
    <Link
      aria-busy={loading || undefined}
      aria-disabled={isBlocked ? true : props["aria-disabled"]}
      data-cuelume-press={isBlocked ? undefined : ""}
      className={getButtonClassName({
        className,
        disabled: isDisabled,
        intent,
        loading,
        variant,
      })}
      tabIndex={isBlocked ? (tabIndex ?? -1) : tabIndex}
      onClick={(event) => {
        if (isBlocked) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
      {...props}
    >
      <ButtonContent
        leftIcon={leftIcon}
        loading={loading}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    </Link>
  );
}
