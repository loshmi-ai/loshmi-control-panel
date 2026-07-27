import type { ReactNode } from "react";

import type {
  DesignSystemComponentId,
  DesignSystemSection,
} from "@src/ui/routes/design-system.types";

type DesignSystemComponentPageBaseProps<Props> = {
  activeComponent: DesignSystemComponentId;
  section: DesignSystemSection<Props>;
};

type DesignSystemComponentPageCustomContentProps<Props> =
  DesignSystemComponentPageBaseProps<Props> & {
    children: ReactNode;
    renderExample?: never;
  };

type DesignSystemComponentPageExamplesProps<Props> =
  DesignSystemComponentPageBaseProps<Props> & {
    children?: never;
    renderExample: (props: Props) => ReactNode;
  };

export type DesignSystemComponentPageProps<Props> =
  | DesignSystemComponentPageCustomContentProps<Props>
  | DesignSystemComponentPageExamplesProps<Props>;
