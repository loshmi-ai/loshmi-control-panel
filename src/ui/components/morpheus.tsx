import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";

import {
  MorphAnchor,
  type ContentOffset,
  type MorphContentLayersProps,
  type MorphDirection,
  type MorphMeasurementNodesProps,
  type MorphOverlayProps,
  type MorphProps,
  type MorphShellProps,
  type MorphSpringPreset,
  type PanelSize,
} from "@src/ui/components/morpheus.types";

/*
 * Morpheus
 *
 * A reusable two-state panel that visually morphs a compact source UI into a
 * larger target UI. The caller owns the state with `expanded`, provides the two
 * pieces of content, and can either pass explicit sizes or CSS class names that
 * define each state. `direction` gives a sensible default hinge point, while
 * `anchor` can override the exact point that stays visually pinned during the
 * morph.
 *
 * The important API rule is that `collapsedContent` and `expandedContent` are
 * rendered as separate layers. They are not the same DOM tree being resized.
 * This lets each state keep its own markup and layout while the component
 * handles the transition between them.
 */
export { MorphAnchor };
export type {
  ContentOffset,
  MorphContentLayersProps,
  MorphDirection,
  MorphMeasurementNodesProps,
  MorphOverlayProps,
  MorphProps,
  MorphShellProps,
  MorphSpringPreset,
  PanelSize,
} from "@src/ui/components/morpheus.types";

export const defaultAnchorByDirection: Record<MorphDirection, MorphAnchor> = {
  top: MorphAnchor.BottomMiddle,
  right: MorphAnchor.LeftMiddle,
  bottom: MorphAnchor.TopMiddle,
  left: MorphAnchor.RightMiddle,
};

const anchorClasses: Record<MorphAnchor, string> = {
  [MorphAnchor.LeftTop]: "left-0 top-0",
  [MorphAnchor.LeftMiddle]: "left-0 top-1/2 -translate-y-1/2",
  [MorphAnchor.LeftBottom]: "bottom-0 left-0",
  [MorphAnchor.TopMiddle]: "left-1/2 top-0 -translate-x-1/2",
  [MorphAnchor.RightTop]: "right-0 top-0",
  [MorphAnchor.RightMiddle]: "right-0 top-1/2 -translate-y-1/2",
  [MorphAnchor.RightBottom]: "bottom-0 right-0",
  [MorphAnchor.BottomMiddle]: "bottom-0 left-1/2 -translate-x-1/2",
};

// Small content offsets keep the outgoing and incoming layers from looking like
// they are perfectly stacked during the crossfade. The offset follows the
// anchor so the content appears to move away from, or settle back into, the
// fixed hinge point.
const anchorContentOffsets: Record<MorphAnchor, ContentOffset> = {
  [MorphAnchor.LeftTop]: { x: -14, y: -14 },
  [MorphAnchor.LeftMiddle]: { x: -16, y: 0 },
  [MorphAnchor.LeftBottom]: { x: -14, y: 14 },
  [MorphAnchor.TopMiddle]: { x: 0, y: -16 },
  [MorphAnchor.RightTop]: { x: 14, y: -14 },
  [MorphAnchor.RightMiddle]: { x: 16, y: 0 },
  [MorphAnchor.RightBottom]: { x: 14, y: 14 },
  [MorphAnchor.BottomMiddle]: { x: 0, y: 16 },
};

// Scale transforms must originate from the same point as the absolute anchor.
// If these ever disagree, the target layer will grow from one point while the
// shell is pinned to another, which makes the morph feel like it is sliding.
const anchorTransformOrigins: Record<MorphAnchor, string> = {
  [MorphAnchor.LeftTop]: "left top",
  [MorphAnchor.LeftMiddle]: "left center",
  [MorphAnchor.LeftBottom]: "left bottom",
  [MorphAnchor.TopMiddle]: "center top",
  [MorphAnchor.RightTop]: "right top",
  [MorphAnchor.RightMiddle]: "right center",
  [MorphAnchor.RightBottom]: "right bottom",
  [MorphAnchor.BottomMiddle]: "center bottom",
};

export const morphSpringPresets = {
  balanced: {
    type: "spring",
    stiffness: 360,
    damping: 34,
    mass: 0.9,
  },
  snappy: {
    type: "spring",
    stiffness: 520,
    damping: 42,
    mass: 0.7,
  },
  smooth: {
    type: "spring",
    stiffness: 300,
    damping: 32,
    mass: 1,
  },
  wobbly: {
    type: "spring",
    stiffness: 260,
    damping: 18,
    mass: 0.9,
  },
  heavy: {
    type: "spring",
    stiffness: 220,
    damping: 34,
    mass: 1.6,
  },
} satisfies Record<MorphSpringPreset, Transition>;

const defaultPanelSpring = morphSpringPresets.balanced;

const contentFade: Transition = {
  duration: 0.22,
  ease: "easeOut",
};

const createSourceContentMotion = (spring: Transition): Transition => ({
  width: spring,
  height: spring,
  opacity: contentFade,
  x: contentFade,
  y: contentFade,
});

const createTargetContentMotion = (spring: Transition): Transition => ({
  opacity: contentFade,
  scaleX: spring,
  scaleY: spring,
  x: contentFade,
  y: contentFade,
});

// Framer Motion scale values are ratios. When a measured target dimension is
// temporarily zero during mount, fall back to 1 so we do not create NaN/Infinity
// transforms and flash a broken frame.
const safeScale = (from: number, to: number) => (to === 0 ? 1 : from / to);

function useMeasuredSize(
  ref: RefObject<HTMLDivElement | null>,
  fallbackSize: PanelSize,
) {
  const [size, setSize] = useState(fallbackSize);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      // We measure real rendered dimensions because callers may size a state
      // with classes instead of fixed numbers. `getBoundingClientRect` includes
      // the result of CSS layout, media queries, and font loading.
      const { width, height } = element.getBoundingClientRect();

      // Invisible measurement nodes can report 0x0 for a moment during mount.
      // Keeping the fallback avoids collapsing the live panel during that tick.
      if (width === 0 || height === 0) {
        return;
      }

      setSize(current =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [fallbackSize.height, fallbackSize.width, ref]);

  return size;
}

function MorphOverlay({
  expanded,
  onClose,
  color,
  opacity,
  blur,
}: MorphOverlayProps) {
  return (
    <AnimatePresence>
      {expanded && onClose ? (
        <motion.button
          type="button"
          aria-label="Close morph"
          className="fixed inset-0 z-40 cursor-default"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{
            opacity,
            backdropFilter: `blur(${blur}px)`,
          }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ backgroundColor: color }}
          onClick={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}

function MorphMeasurementNodes({
  collapsedRef,
  expandedRef,
  collapsedClassName,
  expandedClassName,
  collapsedSize,
  expandedSize,
}: MorphMeasurementNodesProps) {
  return (
    <>
      <div
        ref={collapsedRef}
        aria-hidden="true"
        className={`invisible absolute left-0 top-0 pointer-events-none ${
          collapsedClassName ?? ""
        }`}
        style={
          collapsedClassName
            ? undefined
            : { width: collapsedSize.width, height: collapsedSize.height }
        }
      />
      <div
        ref={expandedRef}
        aria-hidden="true"
        className={`invisible absolute left-0 top-0 pointer-events-none ${
          expandedClassName ?? ""
        }`}
        style={
          expandedClassName
            ? undefined
            : { width: expandedSize.width, height: expandedSize.height }
        }
      />
    </>
  );
}

function MorphShell({
  expanded,
  anchorClassName,
  animatedSize,
  spring,
  children,
}: MorphShellProps) {
  return (
    <motion.div
      className={`absolute overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-2xl shadow-black/10 ${
        expanded ? "z-50" : "z-0"
      } ${anchorClassName}`}
      initial={false}
      animate={{
        width: animatedSize.width,
        height: animatedSize.height,
        borderRadius: expanded ? 28 : 24,
      }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

function MorphContentLayers({
  expanded,
  anchorClassName,
  collapsedContent,
  expandedContent,
  collapsedLayerSize,
  expandedLayerSize,
  contentOffset,
  collapsedToExpandedScale,
  transformOrigin,
  sourceTransition,
  targetTransition,
  onOpen,
}: MorphContentLayersProps) {
  return (
    <>
      <motion.div
        className={`absolute ${anchorClassName}`}
        initial={false}
        animate={{
          width: expanded ? expandedLayerSize.width : collapsedLayerSize.width,
          height: expanded
            ? expandedLayerSize.height
            : collapsedLayerSize.height,
          opacity: expanded ? 0 : 1,
          x: expanded ? contentOffset.x : 0,
          y: expanded ? contentOffset.y : 0,
        }}
        transition={sourceTransition}
        onClick={expanded ? undefined : onOpen}
        style={{
          pointerEvents: expanded ? "none" : "auto",
          transformOrigin,
        }}
      >
        {collapsedContent}
      </motion.div>

      <motion.div
        className={`absolute ${anchorClassName}`}
        initial={false}
        animate={{
          opacity: expanded ? 1 : 0,
          scaleX: expanded ? 1 : collapsedToExpandedScale.x,
          scaleY: expanded ? 1 : collapsedToExpandedScale.y,
          x: expanded ? 0 : contentOffset.x,
          y: expanded ? 0 : contentOffset.y,
        }}
        transition={{
          ...targetTransition,
          opacity: { ...contentFade, delay: expanded ? 0.1 : 0 },
        }}
        style={{
          width: expandedLayerSize.width,
          height: expandedLayerSize.height,
          pointerEvents: expanded ? "auto" : "none",
          transformOrigin,
        }}
      >
        {expandedContent}
      </motion.div>
    </>
  );
}

export function Morpheus({
  direction,
  anchor,
  expanded,
  onOpen,
  onClose,
  collapsedContent,
  expandedContent,
  collapsedSize = { width: 220, height: 88 },
  expandedSize = { width: 420, height: 300 },
  collapsedClassName,
  expandedClassName,
  className = "relative mx-auto h-[360px] w-full max-w-[560px]",
  overlayColor = "#05070a",
  overlayOpacity = 0.54,
  overlayBlur = 8,
  spring = defaultPanelSpring,
}: MorphProps) {
  const collapsedMeasureRef = useRef<HTMLDivElement>(null);
  const expandedMeasureRef = useRef<HTMLDivElement>(null);
  const measuredCollapsedSize = useMeasuredSize(
    collapsedMeasureRef,
    collapsedSize,
  );
  const measuredExpandedSize = useMeasuredSize(expandedMeasureRef, expandedSize);

  // Numeric sizes are the stable default, but class-driven sizing needs the
  // measured values. This keeps the simple API cheap while still allowing a
  // consuming app to provide responsive Tailwind/CSS classes.
  const size = expanded ? expandedSize : collapsedSize;
  const measuredSize = expanded ? measuredExpandedSize : measuredCollapsedSize;
  const animatedSize =
    (expanded ? expandedClassName : collapsedClassName) ? measuredSize : size;

  // The inner layers need their own dimensions because the collapsed and
  // expanded content are separate DOM trees. Each layer uses its own natural
  // size even while the outer shell is animating between states.
  const collapsedLayerSize = collapsedClassName
    ? measuredCollapsedSize
    : collapsedSize;
  const expandedLayerSize = expandedClassName
    ? measuredExpandedSize
    : expandedSize;
  const panelAnchor = anchor ?? defaultAnchorByDirection[direction];
  const anchorClassName = anchorClasses[panelAnchor];
  const contentOffset = anchorContentOffsets[panelAnchor];
  const transformOrigin = anchorTransformOrigins[panelAnchor];
  const sourceContentMotion = createSourceContentMotion(spring);
  const targetContentMotion = createTargetContentMotion(spring);

  // The target layer is always laid out at its expanded size, then scaled down
  // to match the collapsed footprint while hidden. When it opens, we animate
  // scale back to 1. This avoids asking the expanded UI to reflow through every
  // intermediate width/height, which is where text wrapping and grid jumps make
  // morphs look jittery.
  const collapsedToExpandedScale = {
    x: safeScale(collapsedLayerSize.width, expandedLayerSize.width),
    y: safeScale(collapsedLayerSize.height, expandedLayerSize.height),
  };

  return (
    <>
      <MorphOverlay
        expanded={expanded}
        onClose={onClose}
        color={overlayColor}
        opacity={overlayOpacity}
        blur={overlayBlur}
      />
      <div className={className} aria-live="polite">
        <MorphMeasurementNodes
          collapsedRef={collapsedMeasureRef}
          expandedRef={expandedMeasureRef}
          collapsedClassName={collapsedClassName}
          expandedClassName={expandedClassName}
          collapsedSize={collapsedSize}
          expandedSize={expandedSize}
        />
        <MorphShell
          expanded={expanded}
          anchorClassName={anchorClassName}
          animatedSize={animatedSize}
          spring={spring}
        >
          <MorphContentLayers
            expanded={expanded}
            anchorClassName={anchorClassName}
            collapsedContent={collapsedContent}
            expandedContent={expandedContent}
            collapsedLayerSize={collapsedLayerSize}
            expandedLayerSize={expandedLayerSize}
            contentOffset={contentOffset}
            collapsedToExpandedScale={collapsedToExpandedScale}
            transformOrigin={transformOrigin}
            sourceTransition={sourceContentMotion}
            targetTransition={targetContentMotion}
            onOpen={onOpen}
          />
        </MorphShell>
      </div>
    </>
  );
}
