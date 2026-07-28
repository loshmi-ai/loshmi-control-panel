import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

export type InputStatus = "default" | "error";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errors?: string[];
  label?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  status?: InputStatus;
};
