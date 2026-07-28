import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";

import { CuelumeSound } from "@src/ui/lib/cuelume";
import { cn } from "@src/ui/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-control-focus-border focus-visible:ring-[3px] focus-visible:ring-control-focus-ring aria-invalid:border-red-300/65 aria-invalid:ring-red-300/20 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
          "bg-control text-control-foreground shadow-xs hover:bg-control-hover",
        destructive:
          "bg-control-destructive text-control-foreground shadow-xs hover:bg-control-destructive-hover focus-visible:ring-control-destructive-focus",
        ghost:
          "text-control-foreground hover:bg-control-ghost-hover hover:text-control-foreground",
        link: "text-control-foreground underline-offset-4 hover:underline",
        outline:
          "border border-control-border bg-transparent text-control-foreground shadow-xs hover:bg-control-ghost-hover hover:text-control-foreground",
        secondary:
          "bg-control-secondary text-control-foreground shadow-xs hover:bg-control-secondary-hover",
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
