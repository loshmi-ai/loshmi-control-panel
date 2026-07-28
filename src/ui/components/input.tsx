import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";

import { cn } from "@src/ui/lib/utils";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  labelClassName?: string;
};

export function Input({
  className,
  label,
  labelClassName,
  type = "text",
  ...props
}: InputProps) {
  const input = (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-control-input-border bg-transparent px-3 py-1 text-sm text-control-foreground shadow-xs transition-colors outline-none placeholder:text-control-placeholder selection:bg-control selection:text-control-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-control-focus-border focus-visible:ring-control-focus-ring focus-visible:ring-[3px]",
        "aria-invalid:border-destructive/65 aria-invalid:ring-destructive/20",
        className,
      )}
      type={type}
      {...props}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <label className={cn("block", labelClassName)}>
      <span className="mb-2 block text-sm font-semibold text-white/82">
        {label}
      </span>
      {input}
    </label>
  );
}
