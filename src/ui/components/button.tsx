import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";

import { CuelumeSound } from "@src/ui/lib/cuelume";
import { cn } from "@src/ui/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-[var(--control-focus-border)] focus-visible:ring-[3px] focus-visible:ring-[var(--control-focus-ring)] aria-invalid:border-red-300/65 aria-invalid:ring-red-300/20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2",
        icon: "size-9",
        "icon-lg": "size-9",
        "icon-sm": "size-7 rounded-lg",
        "icon-xs": "size-6 rounded-lg [&_svg]:size-3",
        lg: "h-10 rounded-xl px-6",
        sm: "h-8 rounded-xl gap-1.5 px-3",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg]:size-3",
      },
      variant: {
        default:
          "bg-[var(--control)] text-[var(--control-foreground)] shadow-xs hover:bg-[var(--control-hover)]",
        destructive:
          "bg-[var(--control-destructive)] text-white shadow-xs hover:bg-[var(--control-destructive-hover)] focus-visible:ring-[var(--control-destructive-focus)]",
        ghost:
          "text-white hover:bg-[var(--control-ghost-hover)] hover:text-white",
        link: "text-white underline-offset-4 hover:underline",
        outline:
          "border border-[var(--control-border)] bg-transparent text-white shadow-xs hover:bg-[var(--control-ghost-hover)] hover:text-white",
        secondary:
          "bg-[var(--control-secondary)] text-white shadow-xs hover:bg-[var(--control-secondary-hover)]",
      },
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    sound?: CuelumeSound;
  };

function Button({
  className,
  loading = false,
  sound = CuelumeSound.Press,
  size = "default",
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      aria-busy={loading || undefined}
      data-slot="button"
      className={cn(
        buttonVariants({ size, variant }),
        loading && "cursor-wait",
        className,
      )}
      data-cuelume-press={props.disabled || loading ? undefined : sound}
      data-loading={loading || undefined}
      type={type}
      {...props}
    >
      {loading ? <Loader aria-hidden="true" className="animate-spin" /> : null}
      {props.children}
    </ButtonPrimitive>
  );
}

export { Button };
