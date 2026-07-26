import type { ButtonHTMLAttributes } from "react";

const buttonVariants = {
  primary:
    "border border-gray-950 text-white disabled:border-slate-300 disabled:bg-slate-300 disabled:text-white",
  secondary:
    "border border-slate-200 text-gray-950 disabled:bg-slate-100 disabled:text-slate-500",
  danger:
    "border border-red-100 text-red-700 disabled:bg-slate-100 disabled:text-slate-500",
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
        "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-bold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:transform-none",
        buttonVariants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
