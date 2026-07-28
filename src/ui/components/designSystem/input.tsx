import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import type { InputProps } from "@src/ui/components/designSystem/input.types";

const inputStatuses: Record<NonNullable<InputProps["status"]>, string> = {
  default:
    "border-white/10 text-white placeholder:text-white/38 hover:border-emerald-300/45 focus-within:border-emerald-300/45 focus-within:ring-emerald-300/14",
  error:
    "border-red-300/35 text-white placeholder:text-red-200/45 hover:border-red-300/80 focus-within:border-red-300/65 focus-within:ring-red-300/14",
};

export function Input({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  disabled,
  errors = [],
  id,
  label,
  leftIcon: LeftIcon,
  readOnly,
  rightIcon: RightIcon,
  status = "default",
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-errors`;
  const hasErrors = errors.length > 0;
  const resolvedStatus = hasErrors ? "error" : status;
  const isPassword = type === "password";
  const PasswordIcon = isPasswordVisible ? EyeOff : Eye;
  const describedBy = clsx(ariaDescribedBy, hasErrors && errorId) || undefined;

  return (
    <div className={clsx("w-full", className)}>
      {label ? (
        <label
          className="mb-2 block text-sm font-semibold text-white/82"
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <div
        className={clsx(
          "flex min-h-9 w-full items-center gap-2 rounded-md border bg-transparent px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition active:bg-transparent focus-within:ring-4 focus-within:outline-none [-webkit-tap-highlight-color:transparent]",
          inputStatuses[resolvedStatus],
          disabled &&
            "cursor-not-allowed border-white/10 text-white/35 shadow-none hover:border-white/10 focus-within:ring-0 focus-within:outline-none",
        )}
      >
        {LeftIcon ? (
          <LeftIcon
            aria-hidden="true"
            className={clsx(
              "shrink-0",
              resolvedStatus === "error" ? "text-red-200/75" : "text-white/80",
              disabled && "text-white/25",
            )}
            size={18}
            strokeWidth={2.1}
          />
        ) : null}
        <input
          aria-describedby={describedBy}
          aria-invalid={hasErrors ? true : ariaInvalid}
          className="min-w-0 flex-1 border-0 bg-transparent px-0 py-1.5 text-sm outline-none placeholder:text-inherit disabled:cursor-not-allowed disabled:text-white/35"
          disabled={disabled}
          id={inputId}
          readOnly={readOnly}
          type={isPassword && isPasswordVisible ? "text" : type}
          {...props}
        />
        {isPassword ? (
          <button
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="grid size-8 shrink-0 place-items-center rounded-full text-white/58 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-white/25"
            disabled={disabled}
            type="button"
            onClick={() => {
              setIsPasswordVisible((currentValue) => !currentValue);
            }}
          >
            <PasswordIcon aria-hidden="true" size={18} strokeWidth={2.1} />
          </button>
        ) : RightIcon ? (
          <RightIcon
            aria-hidden="true"
            className={clsx(
              "shrink-0",
              resolvedStatus === "error" ? "text-red-200/75" : "text-white/80",
              disabled && "text-white/25",
            )}
            size={18}
            strokeWidth={2.1}
          />
        ) : null}
      </div>
      {hasErrors ? (
        <ul
          className="mt-2 space-y-1 text-sm leading-snug text-red-200"
          id={errorId}
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
