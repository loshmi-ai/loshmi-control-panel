import type { ComponentProps } from "react";

import { cn } from "@src/ui/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm text-white shadow-xs transition-colors outline-none placeholder:text-white/38 selection:bg-white selection:text-neutral-950 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-white/35 focus-visible:ring-white/20 focus-visible:ring-[3px]",
        "aria-invalid:border-red-300/65 aria-invalid:ring-red-300/20",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
