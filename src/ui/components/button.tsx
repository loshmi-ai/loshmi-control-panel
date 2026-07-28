import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@src/ui/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-white/35 focus-visible:ring-[3px] focus-visible:ring-white/20 aria-invalid:border-red-300/65 aria-invalid:ring-red-300/20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2",
        icon: "size-9",
        lg: "h-10 rounded-md px-6",
        sm: "h-8 rounded-md gap-1.5 px-3",
      },
      variant: {
        default: "bg-white text-neutral-950 shadow-xs hover:bg-white/90",
        destructive:
          "bg-red-700 text-white shadow-xs hover:bg-red-800 focus-visible:ring-red-300/40",
        ghost: "text-white hover:bg-white/10 hover:text-white",
        link: "text-white underline-offset-4 hover:underline",
        outline:
          "border border-white/20 bg-transparent text-white shadow-xs hover:bg-white/10 hover:text-white",
        secondary: "bg-white/14 text-white shadow-xs hover:bg-white/20",
      },
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  loading = false,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ size, variant }),
        loading && "cursor-wait",
        className,
      )}
      data-cuelume-press={props.disabled || loading ? undefined : ""}
      data-loading={loading || undefined}
      type={type}
      {...props}
    >
      {loading ? (
        <Loader aria-hidden="true" className="animate-spin" />
      ) : null}
      {props.children}
    </button>
  );
}
