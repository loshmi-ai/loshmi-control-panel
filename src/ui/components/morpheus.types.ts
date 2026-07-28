import type { Transition } from "framer-motion";
import type { ReactNode, RefObject } from "react";

export type MorphDirection = "top" | "right" | "bottom" | "left";

export enum MorphAnchor {
  LeftTop = "left-top",
  LeftMiddle = "left-middle",
  LeftBottom = "left-bottom",
  TopMiddle = "top-middle",
  MiddleMiddle = "middle-middle",
  RightTop = "right-top",
  RightMiddle = "right-middle",
  RightBottom = "right-bottom",
  BottomMiddle = "bottom-middle",
}

export type PanelSize = { width: number; height: number };
export type ContentOffset = { x: number; y: number };
export type PanelPosition = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};
export type PanelVisualStyle = {
  backgroundColor: string;
  borderRadius: string;
};
export type MorphSpringPreset =
  "balanced" | "snappy" | "smooth" | "wobbly" | "heavy";

export type MorphProps = {
  // Direction describes where the panel opens from. It only picks the default
  // anchor; pass `anchor` when the visual hinge needs to be more specific.
  direction: MorphDirection;
  anchor?: MorphAnchor;
  expanded: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  overlayBlur?: number;
  spring?: Transition;
};

export type MorphOverlayProps = {
  expanded: boolean;
  onClose?: () => void;
  color: string;
  opacity: number;
  blur: number;
};

export type MorphMeasurementNodesProps = {
  collapsedRef: RefObject<HTMLDivElement | null>;
  expandedRef: RefObject<HTMLDivElement | null>;
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
};

export type MorphShellProps = {
  expanded: boolean;
  position: PanelPosition;
  animatedSize: PanelSize;
  visualStyle: PanelVisualStyle;
  spring: Transition;
  children: ReactNode;
};

export type MorphContentLayersProps = {
  expanded: boolean;
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  collapsedLayerSize: PanelSize;
  expandedLayerSize: PanelSize;
  sourcePosition: PanelPosition;
  targetPosition: PanelPosition;
  sourceGrowthScale: ContentOffset;
  collapsedToExpandedScale: ContentOffset;
  transformOrigin: string;
  sourceTransition: Transition;
  targetTransition: Transition;
  onOpen?: () => void;
};
