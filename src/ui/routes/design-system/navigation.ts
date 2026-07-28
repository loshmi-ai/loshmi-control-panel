import type { DesignSystemComponentLink } from "@src/ui/routes/design-system.types";

export const designSystemComponentLinks = [
  {
    description: "Contrast surfaces for grouped UI and preview containers.",
    id: "frame",
    path: "/design-system/frame",
    title: "Frame",
  },
  {
    description: "Two-state surfaces that morph source controls into targets.",
    id: "morpheus",
    path: "/design-system/morpheus",
    title: "Morpheus",
  },
] satisfies DesignSystemComponentLink[];
