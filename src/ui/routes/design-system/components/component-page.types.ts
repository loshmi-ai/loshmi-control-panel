import type { ReactNode } from "react";

import type {
  DesignSystemComponentId,
  DesignSystemSection,
} from "@src/ui/routes/design-system.types";

export type DesignSystemComponentPageProps<Props> = {
  activeComponent: DesignSystemComponentId;
  renderExample: (props: Props) => ReactNode;
  section: DesignSystemSection<Props>;
};
