import type { HTMLAttributes, ReactNode } from "react";

export type FrameProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  borderVisible: boolean;
  children: ReactNode;
  standout?: boolean;
};
