import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";

import { cn } from "@src/ui/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-[var(--control-input-border)] bg-transparent px-3 py-1 text-sm text-white shadow-xs transition-colors outline-none placeholder:text-[var(--control-placeholder)] selection:bg-[var(--control)] selection:text-[var(--control-foreground)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--control-focus-border)] focus-visible:ring-[var(--control-focus-ring)] focus-visible:ring-[3px]",
        "aria-invalid:border-destructive/65 aria-invalid:ring-destructive/20",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
