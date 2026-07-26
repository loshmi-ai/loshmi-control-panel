import type { ButtonHTMLAttributes } from "react";

const buttonVariants = {
  primary: "bg-gray-950 text-white disabled:bg-slate-400 disabled:text-white",
  secondary:
    "border border-slate-300 bg-white text-gray-950 disabled:bg-slate-100 disabled:text-slate-500",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
};

function cx(...classNames: (false | null | string | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-semibold disabled:cursor-not-allowed",
        buttonVariants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
