import type { DesignSystemComponentLink } from "@src/ui/routes/design-system.types";

export const designSystemComponentLinks = [
  {
    description: "Actions for forms, navigation, and destructive workflows.",
    id: "button",
    path: "/design-system/button",
    title: "Button",
  },
  {
    description: "Reusable visual emphasis levels for design-system controls.",
    id: "variants",
    path: "/design-system/variants",
    title: "Variants",
  },
  {
    description: "Reusable semantic tone for normal and dangerous actions.",
    id: "intents",
    path: "/design-system/intents",
    title: "Intents",
  },
  {
    description: "Single-line text entry for auth, settings, and forms.",
    id: "input",
    path: "/design-system/input",
    title: "Input",
  },
  {
    description: "Structured data display for dense administrative views.",
    id: "table",
    path: "/design-system/table",
    title: "Table",
  },
] satisfies DesignSystemComponentLink[];
