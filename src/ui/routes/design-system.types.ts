export type DesignSystemComponentId =
  "button" | "intents" | "input" | "table" | "variants";

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

export type DesignSystemExampleGroup<Props> = {
  description?: string;
  examples: DesignSystemExample<Props>[];
  title: string;
};

export type DesignSystemSection<Props> = DesignSystemComponentLink & {
  component: DesignSystemComponentId;
  exampleGroups?: DesignSystemExampleGroup<Props>[];
  examples?: DesignSystemExample<Props>[];
  previewClassName: string;
};
