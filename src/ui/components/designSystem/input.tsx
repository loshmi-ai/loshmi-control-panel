import type { InputHTMLAttributes } from "react";

const inputStatuses = {
  default:
    "border-slate-300 text-gray-950 placeholder:text-slate-400 focus:border-gray-950 focus:ring-gray-950/15",
  error:
    "border-red-300 text-red-950 placeholder:text-red-300 focus:border-red-600 focus:ring-red-600/15",
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  status?: keyof typeof inputStatuses;
};

function cx(...classNames: (false | null | string | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}

export function Input({
  className,
  status = "default",
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      className={cx(
        "min-h-11 w-full rounded-md border bg-white px-3 text-base transition outline-none focus:ring-4 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 read-only:bg-slate-50",
        inputStatuses[status],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
