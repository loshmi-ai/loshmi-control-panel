export type DesignSystemComponentId = "button" | "input";

export type DesignSystemComponentLink = {
  description: string;
  id: DesignSystemComponentId;
  path: string;
  title: string;
};

export type DesignSystemExample<Props> = {
  description: string;
  props: Props;
  title: string;
};

export type DesignSystemSection<Props> = DesignSystemComponentLink & {
  component: DesignSystemComponentId;
  examples: DesignSystemExample<Props>[];
  previewClassName: string;
};
