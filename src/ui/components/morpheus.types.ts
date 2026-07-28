import type { Transition } from "framer-motion";
import type { ReactNode, RefObject } from "react";

export type MorphDirection = "top" | "right" | "bottom" | "left";

export enum MorphAnchor {
  LeftTop = "left-top",
  LeftMiddle = "left-middle",
  LeftBottom = "left-bottom",
  TopMiddle = "top-middle",
  RightTop = "right-top",
  RightMiddle = "right-middle",
  RightBottom = "right-bottom",
  BottomMiddle = "bottom-middle",
}

export type PanelSize = { width: number; height: number };
export type ContentOffset = { x: number; y: number };
export type MorphSpringPreset =
  | "balanced"
  | "snappy"
  | "smooth"
  | "wobbly"
  | "heavy";

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
  collapsedSize?: PanelSize;
  expandedSize?: PanelSize;
  collapsedClassName?: string;
  expandedClassName?: string;
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
  collapsedClassName?: string;
  expandedClassName?: string;
  collapsedSize: PanelSize;
  expandedSize: PanelSize;
};

export type MorphShellProps = {
  expanded: boolean;
  anchorClassName: string;
  animatedSize: PanelSize;
  spring: Transition;
  children: ReactNode;
};

export type MorphContentLayersProps = {
  expanded: boolean;
  anchorClassName: string;
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  collapsedLayerSize: PanelSize;
  expandedLayerSize: PanelSize;
  contentOffset: ContentOffset;
  collapsedToExpandedScale: ContentOffset;
  transformOrigin: string;
  sourceTransition: Transition;
  targetTransition: Transition;
  onOpen?: () => void;
};
