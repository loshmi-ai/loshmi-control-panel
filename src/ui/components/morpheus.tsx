import { AnimatePresence, type Transition, motion } from "framer-motion";
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  type ContentOffset,
  MorphAnchor,
  type MorphContentLayersProps,
  type MorphDirection,
  type MorphMeasurementNodesProps,
  type MorphOverlayProps,
  type MorphProps,
  type MorphShellProps,
  type MorphSpringPreset,
  type PanelPosition,
  type PanelSize,
  type PanelVisualStyle,
} from "@src/ui/components/morpheus.types";

/*
 * Morpheus
 *
 * A reusable two-state panel that visually morphs a compact source UI into a
 * larger target UI. The caller owns the state with `expanded`, provides the two
 * pieces of content, and Morpheus measures both states automatically.
 * `direction` gives a sensible default hinge point, while `anchor` can override
 * the exact point that stays visually pinned during the morph.
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
  PanelPosition,
  PanelVisualStyle,
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

// Scale transforms must originate from the same point as the absolute anchor.
// If these ever disagree, the target layer will grow from one point while the
// shell is pinned to another, which makes the morph feel like it is sliding.
const anchorTransformOrigins: Record<MorphAnchor, string> = {
  [MorphAnchor.LeftTop]: "left top",
  [MorphAnchor.LeftMiddle]: "left center",
  [MorphAnchor.LeftBottom]: "left bottom",
  [MorphAnchor.TopMiddle]: "center top",
  [MorphAnchor.MiddleMiddle]: "center center",
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
const sourceContentFade: Transition = {
  duration: 0.12,
  ease: "easeOut",
};
const sourceReturnDelay = 0.06;

const instantTransition: Transition = { duration: 0 };
const defaultVisualStyle: PanelVisualStyle = {
  backgroundColor: "transparent",
  borderRadius: "0px",
};
const liveSurfaceContentClassName =
  "absolute [&>*:first-child]:!border-transparent [&>*:first-child]:!bg-transparent [&>*:first-child]:!shadow-none";

const createSourceContentMotion = (spring: Transition): Transition => ({
  opacity: sourceContentFade,
  scaleX: spring,
  scaleY: spring,
  left: spring,
  top: spring,
});

const createTargetContentMotion = (spring: Transition): Transition => ({
  opacity: contentFade,
  scaleX: spring,
  scaleY: spring,
  left: spring,
  top: spring,
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
  const [visualStyle, setVisualStyle] = useState(defaultVisualStyle);
  const [measured, setMeasured] = useState(false);

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

      setMeasured(true);
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );

      const surfaceElement =
        element.firstElementChild instanceof HTMLElement
          ? element.firstElementChild
          : element;
      const computedStyle = getComputedStyle(surfaceElement);
      const nextVisualStyle = {
        backgroundColor: computedStyle.backgroundColor,
        borderRadius: computedStyle.borderTopLeftRadius,
      };

      setVisualStyle((current) =>
        current.backgroundColor === nextVisualStyle.backgroundColor &&
        current.borderRadius === nextVisualStyle.borderRadius
          ? current
          : nextVisualStyle,
      );
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [fallbackSize.height, fallbackSize.width, ref]);

  return { measured, size, visualStyle };
}

function getAnchoredPanelPosition(
  anchor: MorphAnchor,
  collapsedSize: PanelSize,
  targetSize: PanelSize,
): PanelPosition {
  const alignLeft = 0;
  const alignCenterX = (collapsedSize.width - targetSize.width) / 2;
  const alignRight = collapsedSize.width - targetSize.width;
  const alignTop = 0;
  const alignCenterY = (collapsedSize.height - targetSize.height) / 2;
  const alignBottom = collapsedSize.height - targetSize.height;

  switch (anchor) {
    case MorphAnchor.LeftTop:
      return { left: alignLeft, top: alignTop };
    case MorphAnchor.LeftMiddle:
      return { left: alignLeft, top: alignCenterY };
    case MorphAnchor.LeftBottom:
      return { left: alignLeft, top: alignBottom };
    case MorphAnchor.TopMiddle:
      return { left: alignCenterX, top: alignTop };
    case MorphAnchor.MiddleMiddle:
      return { left: alignCenterX, top: alignCenterY };
    case MorphAnchor.RightTop:
      return { left: alignRight, top: alignTop };
    case MorphAnchor.RightMiddle:
      return { left: alignRight, top: alignCenterY };
    case MorphAnchor.RightBottom:
      return { left: alignRight, top: alignBottom };
    case MorphAnchor.BottomMiddle:
      return { left: alignCenterX, top: alignBottom };
  }
}

function invertPosition(position: PanelPosition): PanelPosition {
  return {
    left: -(position.left ?? 0),
    top: -(position.top ?? 0),
  };
}

function getOverlayBackgroundColor(color: string, opacity: number) {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const red = Number.parseInt(color.slice(1, 3), 16);
    const green = Number.parseInt(color.slice(3, 5), 16);
    const blue = Number.parseInt(color.slice(5, 7), 16);

    return `rgb(${red} ${green} ${blue} / ${opacity})`;
  }

  return color;
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
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            backdropFilter: `blur(${blur}px)`,
            backgroundColor: getOverlayBackgroundColor(color, opacity),
            WebkitBackdropFilter: `blur(${blur}px)`,
          }}
          onClick={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}

function MorphMeasurementNodes({
  collapsedRef,
  expandedRef,
  collapsedContent,
  expandedContent,
}: MorphMeasurementNodesProps) {
  return (
    <>
      <div
        ref={collapsedRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 pointer-events-none"
      >
        {collapsedContent}
      </div>
      <div
        ref={expandedRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 pointer-events-none"
      >
        {expandedContent}
      </div>
    </>
  );
}

function MorphShell({
  expanded,
  position,
  animatedSize,
  visualStyle,
  spring,
  children,
}: MorphShellProps) {
  return (
    <motion.div
      className={`absolute overflow-hidden shadow-xs ${expanded ? "z-50" : "z-0"}`}
      initial={false}
      animate={{
        width: animatedSize.width,
        height: animatedSize.height,
        backgroundColor: visualStyle.backgroundColor,
        borderRadius: visualStyle.borderRadius,
        ...position,
      }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

function MorphContentLayers({
  expanded,
  collapsedContent,
  expandedContent,
  collapsedLayerSize,
  expandedLayerSize,
  sourcePosition,
  targetPosition,
  sourceToExpandedScale,
  collapsedToExpandedScale,
  transformOrigin,
  sourceTransition,
  targetTransition,
  onOpen,
}: MorphContentLayersProps) {
  return (
    <>
      <motion.div
        className={liveSurfaceContentClassName}
        initial={false}
        animate={{
          opacity: expanded ? 0 : 1,
          scaleX: expanded ? sourceToExpandedScale.x : 1,
          scaleY: expanded ? sourceToExpandedScale.y : 1,
          ...sourcePosition,
        }}
        transition={{
          ...sourceTransition,
          opacity: {
            ...sourceContentFade,
            delay: expanded ? 0 : sourceReturnDelay,
          },
        }}
        onClick={expanded ? undefined : onOpen}
        style={{
          width: collapsedLayerSize.width,
          height: collapsedLayerSize.height,
          pointerEvents: expanded ? "none" : "auto",
          transformOrigin,
        }}
      >
        {collapsedContent}
      </motion.div>

      <motion.div
        className={liveSurfaceContentClassName}
        initial={false}
        animate={{
          opacity: expanded ? 1 : 0,
          scaleX: expanded ? 1 : collapsedToExpandedScale.x,
          scaleY: expanded ? 1 : collapsedToExpandedScale.y,
          ...targetPosition,
        }}
        transition={{
          ...targetTransition,
          opacity: { ...contentFade, delay: expanded ? 0.03 : 0 },
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
  className = "relative inline-block align-top",
  overlayColor = "#05070a",
  overlayOpacity = 0.54,
  overlayBlur = 0,
  spring = defaultPanelSpring,
}: MorphProps) {
  const collapsedMeasureRef = useRef<HTMLDivElement>(null);
  const expandedMeasureRef = useRef<HTMLDivElement>(null);
  const measuredCollapsed = useMeasuredSize(collapsedMeasureRef, {
    width: 1,
    height: 1,
  });
  const measuredExpanded = useMeasuredSize(expandedMeasureRef, {
    width: 1,
    height: 1,
  });
  const measurementsReady =
    measuredCollapsed.measured && measuredExpanded.measured;
  const [animationEnabled, setAnimationEnabled] = useState(false);

  useEffect(() => {
    if (!measurementsReady) {
      return;
    }

    const frame = requestAnimationFrame(() => setAnimationEnabled(true));

    return () => cancelAnimationFrame(frame);
  }, [measurementsReady]);

  // Real hidden content measurement lets ordinary controls, such as Button,
  // define the source footprint without requiring a Morpheus-specific class.
  const measuredCollapsedSize = measuredCollapsed.size;
  const measuredExpandedSize = measuredExpanded.size;
  const measuredSize = expanded ? measuredExpandedSize : measuredCollapsedSize;
  const animatedSize = measuredSize;
  const visualStyle = expanded
    ? measuredExpanded.visualStyle
    : measuredCollapsed.visualStyle;

  // The inner layers need their own dimensions because the collapsed and
  // expanded content are separate DOM trees. Each layer uses its own natural
  // size even while the outer shell is animating between states.
  const collapsedLayerSize = measuredCollapsedSize;
  const expandedLayerSize = measuredExpandedSize;
  const panelAnchor = anchor ?? defaultAnchorByDirection[direction];
  const sourcePanelPosition = { left: 0, top: 0 };
  const targetPanelPosition = getAnchoredPanelPosition(
    panelAnchor,
    collapsedLayerSize,
    expandedLayerSize,
  );
  const anchorPosition = expanded ? targetPanelPosition : sourcePanelPosition;
  const sourcePosition = expanded
    ? invertPosition(targetPanelPosition)
    : sourcePanelPosition;
  const targetPosition = expanded ? sourcePanelPosition : targetPanelPosition;
  const transformOrigin = anchorTransformOrigins[panelAnchor];
  const activeSpring = animationEnabled ? spring : instantTransition;
  const sourceContentMotion = createSourceContentMotion(activeSpring);
  const targetContentMotion = createTargetContentMotion(activeSpring);

  // The target layer is always laid out at its expanded size, then scaled down
  // to match the collapsed footprint while hidden. When it opens, we animate
  // scale back to 1. This avoids asking the expanded UI to reflow through every
  // intermediate width/height, which is where text wrapping and grid jumps make
  // morphs look jittery.
  const collapsedToExpandedScale = {
    x: safeScale(collapsedLayerSize.width, expandedLayerSize.width),
    y: safeScale(collapsedLayerSize.height, expandedLayerSize.height),
  };
  const sourceToExpandedScale = {
    x: safeScale(expandedLayerSize.width, collapsedLayerSize.width),
    y: safeScale(expandedLayerSize.height, collapsedLayerSize.height),
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
          collapsedContent={collapsedContent}
          expandedContent={expandedContent}
        />
        <div
          aria-hidden="true"
          style={{
            visibility: "hidden",
            width: collapsedLayerSize.width,
            height: collapsedLayerSize.height,
          }}
        />
        <MorphShell
          expanded={expanded}
          position={anchorPosition}
          animatedSize={animatedSize}
          visualStyle={visualStyle}
          spring={activeSpring}
        >
          <MorphContentLayers
            expanded={expanded}
            collapsedContent={collapsedContent}
            expandedContent={expandedContent}
            collapsedLayerSize={collapsedLayerSize}
            expandedLayerSize={expandedLayerSize}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            sourceToExpandedScale={sourceToExpandedScale}
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
