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
          standout ? "bg-[#363638]" : "bg-[#242425]",
          borderVisible
            ? standout
              ? "border-[#979797]"
              : "border-[#434343]"
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
