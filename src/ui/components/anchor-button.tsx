import type { VariantProps } from "class-variance-authority";
import type { LinkProps } from "react-router";
import { Link } from "react-router";

import { buttonVariants } from "@src/ui/components/button";
import { cn } from "@src/ui/lib/utils";

export function AnchorButton({
  className,
  onClick,
  size,
  tabIndex,
  variant,
  ...props
}: LinkProps & VariantProps<typeof buttonVariants>) {
  const isDisabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true";

  return (
    <Link
      className={cn(buttonVariants({ className, size, variant }))}
      data-cuelume-press={isDisabled ? undefined : ""}
      tabIndex={isDisabled ? (tabIndex ?? -1) : tabIndex}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
