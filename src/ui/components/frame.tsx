import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import type { FrameProps } from "@src/ui/components/frame.types";

export function Frame({
  borderVisible,
  children,
  className,
  standout = false,
  ...props
}: FrameProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-lg border",
          standout ? "bg-frame-standout" : "bg-frame",
          borderVisible
            ? standout
              ? "border-frame-standout-border"
              : "border-frame-border"
            : "border-transparent",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
}
