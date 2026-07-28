import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { type LoaderFunctionArgs } from "react-router";

import { AppShell } from "@src/ui/components/app-shell";
import { Button } from "@src/ui/components/button";
import { Frame } from "@src/ui/components/frame";
import {
  MorphAnchor,
  type MorphDirection,
  type MorphSpringPreset,
  Morpheus,
  morphSpringPresets,
} from "@src/ui/components/morpheus";
import { getUserOrRedirectToLogin } from "@src/ui/domain/auth.server";
import { cn } from "@src/ui/lib/utils";
import type { DesignSystemSection } from "@src/ui/routes/design-system.types";
import { DesignSystemComponentPage } from "@src/ui/routes/design-system/components/component-page";

const morpheusSection: DesignSystemSection<never> = {
  component: "morpheus",
  description:
    "Two-state surfaces that morph source controls into target content.",
  id: "morpheus",
  path: "/design-system/morpheus",
  previewClassName: "text-white",
  title: "Morpheus",
};

type MorphPossibility = {
  anchor?: MorphAnchor;
  direction: MorphDirection;
  overlayBlur?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  spring: MorphSpringPreset;
  subtitle: string;
  targetClassName?: string;
  targetVariant?: "chart" | "command" | "profile" | "settings";
  title: string;
};

type MorphPossibilityGroup = {
  possibilities: readonly MorphPossibility[];
  subtitle: string;
  title: string;
};

const defaultSpring = "balanced" satisfies MorphSpringPreset;
const defaultDirection = "bottom" satisfies MorphDirection;
const defaultAnchor = MorphAnchor.TopMiddle;

const triggerIconByDirection: Record<MorphDirection, LucideIcon> = {
  top: ChevronUpIcon,
  right: ChevronRightIcon,
  bottom: ChevronDownIcon,
  left: ChevronLeftIcon,
};

const morphPossibilityGroups: readonly MorphPossibilityGroup[] = [
  {
    title: "Animation Directions",
    subtitle: "Every direction using Morpheus' default anchor for that side.",
    possibilities: [
      {
        direction: "top",
        spring: defaultSpring,
        title: "Top",
        subtitle: "Opens upward from the collapsed control.",
      },
      {
        direction: "right",
        spring: defaultSpring,
        title: "Right",
        subtitle: "Opens toward the inline end of the control.",
      },
      {
        direction: "bottom",
        spring: defaultSpring,
        title: "Bottom",
        subtitle: "Opens below the collapsed control.",
      },
      {
        direction: "left",
        spring: defaultSpring,
        title: "Left",
        subtitle: "Opens toward the inline start of the control.",
      },
    ],
  },
  {
    title: "Anchor Points",
    subtitle: "Every explicit hinge point available to the panel.",
    possibilities: [
      {
        anchor: MorphAnchor.LeftTop,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Left Top",
        subtitle: "Pins the expanded surface to the left-top corner.",
      },
      {
        anchor: MorphAnchor.TopMiddle,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Top Middle",
        subtitle: "Pins the expanded surface to the top edge center.",
      },
      {
        anchor: MorphAnchor.RightTop,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Right Top",
        subtitle: "Pins the expanded surface to the right-top corner.",
      },
      {
        anchor: MorphAnchor.LeftMiddle,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Left Middle",
        subtitle: "Pins the expanded surface to the left edge center.",
      },
      {
        anchor: MorphAnchor.MiddleMiddle,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Middle Middle",
        subtitle: "Pins the expanded surface to the center point.",
      },
      {
        anchor: MorphAnchor.RightMiddle,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Right Middle",
        subtitle: "Pins the expanded surface to the right edge center.",
      },
      {
        anchor: MorphAnchor.LeftBottom,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Left Bottom",
        subtitle: "Pins the expanded surface to the left-bottom corner.",
      },
      {
        anchor: MorphAnchor.BottomMiddle,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Bottom Middle",
        subtitle: "Pins the expanded surface to the bottom edge center.",
      },
      {
        anchor: MorphAnchor.RightBottom,
        direction: defaultDirection,
        spring: defaultSpring,
        title: "Right Bottom",
        subtitle: "Pins the expanded surface to the right-bottom corner.",
      },
    ],
  },
  {
    title: "Spring Presets",
    subtitle: "Every bundled motion feel using the same direction and anchor.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: "balanced",
        title: "Balanced",
        subtitle: "Default response for most interface surfaces.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: "snappy",
        title: "Snappy",
        subtitle: "Higher stiffness for quick, crisp transitions.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: "smooth",
        title: "Smooth",
        subtitle: "Softer movement with measured damping.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: "wobbly",
        title: "Wobbly",
        subtitle: "Lower damping to expose spring overshoot.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: "heavy",
        title: "Heavy",
        subtitle: "More mass for a slower weighted expansion.",
      },
    ],
  },
  {
    title: "Target Sizes",
    subtitle: "Different expanded surface sizes from the same compact trigger.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        targetClassName: "w-40 p-3",
        title: "Compact",
        subtitle: "Small target content for lightweight controls.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        targetClassName: "w-56 p-3",
        title: "Default",
        subtitle: "Standard target content size.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        targetClassName: "w-72 p-4",
        title: "Wide",
        subtitle: "Wider target content for denser horizontal layouts.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        targetClassName: "w-56 min-h-64 p-4",
        title: "Tall",
        subtitle: "Taller target content for stacked details.",
      },
    ],
  },
  {
    title: "Target Components",
    subtitle:
      "Different expanded component structures from the same compact trigger.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        subtitle: "A compact metric card with chart-like content.",
        targetClassName: "w-64 p-4",
        targetVariant: "chart",
        title: "Metric Card",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        subtitle: "A command palette style target with stacked actions.",
        targetClassName: "w-72 p-2",
        targetVariant: "command",
        title: "Command List",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        subtitle: "A profile summary with identity and status content.",
        targetClassName: "w-60 p-4",
        targetVariant: "profile",
        title: "Profile Panel",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        spring: defaultSpring,
        subtitle: "A settings panel with controls and separated rows.",
        targetClassName: "w-80 p-4",
        targetVariant: "settings",
        title: "Settings Panel",
      },
    ],
  },
  {
    title: "Overlay Colors",
    subtitle: "Different backdrop colors using the default opacity and blur.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayColor: "#020617",
        spring: defaultSpring,
        title: "Slate",
        subtitle: "Neutral dark backdrop.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayColor: "#082f49",
        spring: defaultSpring,
        title: "Blue",
        subtitle: "Cool blue backdrop.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayColor: "#064e3b",
        spring: defaultSpring,
        title: "Emerald",
        subtitle: "Green tinted backdrop.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayColor: "#4c0519",
        spring: defaultSpring,
        title: "Rose",
        subtitle: "Warm red backdrop.",
      },
    ],
  },
  {
    title: "Overlay Opacity",
    subtitle:
      "Different backdrop opacity levels using the default color and blur.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayOpacity: 0.18,
        spring: defaultSpring,
        title: "Opacity 18%",
        subtitle: "Light dimming for low interruption.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayOpacity: 0.36,
        spring: defaultSpring,
        title: "Opacity 36%",
        subtitle: "Moderate dimming for contextual panels.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayOpacity: 0.54,
        spring: defaultSpring,
        title: "Opacity 54%",
        subtitle: "Default modal-like focus treatment.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayOpacity: 0.72,
        spring: defaultSpring,
        title: "Opacity 72%",
        subtitle: "Dense dimming for high-priority surfaces.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayOpacity: 1,
        spring: defaultSpring,
        title: "Opacity 100%",
        subtitle: "Fully opaque backdrop for complete isolation.",
      },
    ],
  },
  {
    title: "Overlay Blur",
    subtitle:
      "Different backdrop blur strengths using the default color and opacity.",
    possibilities: [
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayBlur: 0,
        spring: defaultSpring,
        title: "Blur 0px",
        subtitle: "No backdrop blur.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayBlur: 4,
        spring: defaultSpring,
        title: "Blur 4px",
        subtitle: "Subtle backdrop separation.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayBlur: 8,
        spring: defaultSpring,
        title: "Blur 8px",
        subtitle: "Default blurred overlay treatment.",
      },
      {
        anchor: defaultAnchor,
        direction: defaultDirection,
        overlayBlur: 16,
        spring: defaultSpring,
        title: "Blur 16px",
        subtitle: "Strong blur for deeper focus.",
      },
    ],
  },
];

export function meta() {
  return [{ title: "Morpheus | Design System | Loshmi Control Panel" }];
}

export async function loader(args: LoaderFunctionArgs) {
  return {
    user: getUserOrRedirectToLogin(args),
  };
}

function MorpheusExpandedContent({
  overlayLabels,
  possibility,
}: {
  overlayLabels: string[];
  possibility: MorphPossibility;
}) {
  if (possibility.targetVariant === "chart") {
    return (
      <Frame
        borderVisible={false}
        className={cn("w-52 p-3", possibility.targetClassName)}
      >
        <p className="text-sm font-semibold text-white/90">Revenue Momentum</p>
        <div className="mt-3 flex items-end gap-1.5">
          {[34, 48, 42, 68, 58, 84, 74].map((height) => (
            <div
              className="w-full rounded-sm bg-cyan-300/25"
              key={height}
              style={{ height }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-white">$48.2k</span>
          <span className="text-xs text-emerald-300">+12.8%</span>
        </div>
      </Frame>
    );
  }

  if (possibility.targetVariant === "command") {
    return (
      <Frame
        borderVisible={false}
        className={cn("w-52 p-3", possibility.targetClassName)}
      >
        {["Create Invoice", "Invite Member", "Export Report", "Open Audit"].map(
          (action) => (
            <button
              className="flex h-9 w-full items-center justify-between rounded-md px-2 text-left text-sm text-white/82 hover:bg-white/8"
              key={action}
              type="button"
            >
              <span>{action}</span>
              <ChevronDownIcon className="-rotate-90 size-3.5 text-white/40" />
            </button>
          ),
        )}
      </Frame>
    );
  }

  if (possibility.targetVariant === "profile") {
    return (
      <Frame
        borderVisible={false}
        className={cn("w-52 p-3", possibility.targetClassName)}
      >
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-rose-300/20 text-sm font-semibold text-rose-100">
            LS
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">Loshmi Studio</p>
            <p className="mt-0.5 text-xs text-white/52">Active workspace</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-white/[0.04] p-2">
            <p className="text-white/45">Seats</p>
            <p className="mt-1 font-semibold text-white/85">18</p>
          </div>
          <div className="rounded-md bg-white/[0.04] p-2">
            <p className="text-white/45">Status</p>
            <p className="mt-1 font-semibold text-emerald-300">Synced</p>
          </div>
        </div>
      </Frame>
    );
  }

  if (possibility.targetVariant === "settings") {
    return (
      <Frame
        borderVisible={false}
        className={cn("w-52 p-3", possibility.targetClassName)}
      >
        <p className="text-sm font-semibold text-white/90">Panel Settings</p>
        {[
          ["Auto save", "On"],
          ["Notifications", "Muted"],
          ["Theme sync", "System"],
        ].map(([label, value]) => (
          <div
            className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-sm"
            key={label}
          >
            <span className="text-white/68">{label}</span>
            <span className="font-medium text-white/88">{value}</span>
          </div>
        ))}
      </Frame>
    );
  }

  return (
    <Frame
      borderVisible={false}
      className={cn("w-52 p-3", possibility.targetClassName)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white/90">
            {possibility.title}
          </p>
          <p className="mt-1 text-xs text-white/52">
            {possibility.direction}
            {possibility.anchor ? ` / ${possibility.anchor}` : ""}
          </p>
        </div>
        <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-white/62">
          {possibility.spring}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <div className="h-10 rounded-md bg-cyan-300/20" />
        <div className="h-10 rounded-md bg-emerald-300/18" />
        <div className="h-10 rounded-md bg-rose-300/18" />
      </div>
      {overlayLabels.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/58">
          {overlayLabels.map((label) => (
            <span
              className="rounded-md border border-white/10 px-1.5 py-0.5"
              key={label}
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </Frame>
  );
}

function MorpheusPossibilityDemo({
  possibility,
}: {
  possibility: MorphPossibility;
}) {
  const [expanded, setExpanded] = useState(false);
  const overlayLabels = [
    possibility.overlayColor,
    possibility.overlayOpacity !== undefined
      ? `${possibility.overlayOpacity}`
      : undefined,
    possibility.overlayBlur !== undefined
      ? `${possibility.overlayBlur}px`
      : undefined,
  ].filter((label) => label !== undefined);
  const hasOverlayVariant = overlayLabels.length > 0;
  const TriggerIcon = triggerIconByDirection[possibility.direction];

  return (
    <section className="min-w-0">
      <h3 className="text-sm font-semibold text-white/90">
        {possibility.title}
      </h3>
      <p className="mt-1 min-h-10 text-sm leading-relaxed text-white/58">
        {possibility.subtitle}
      </p>
      {hasOverlayVariant ? (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-white/58">
          {overlayLabels.map((label) => (
            <span
              className="rounded-md border border-white/10 px-1.5 py-0.5"
              key={label}
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex min-h-44 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] px-16 py-14">
        <Morpheus
          anchor={possibility.anchor}
          direction={possibility.direction}
          expanded={expanded}
          onClose={() => setExpanded(false)}
          onOpen={() => setExpanded(true)}
          overlayBlur={possibility.overlayBlur}
          overlayColor={possibility.overlayColor}
          overlayOpacity={possibility.overlayOpacity}
          spring={morphSpringPresets[possibility.spring]}
          collapsedContent={
            <Button size="sm" variant="secondary">
              {possibility.title}
              <TriggerIcon />
            </Button>
          }
          expandedContent={
            <MorpheusExpandedContent
              overlayLabels={overlayLabels}
              possibility={possibility}
            />
          }
        />
      </div>
    </section>
  );
}

export default function DesignSystemMorpheus({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <AppShell user={loaderData.user}>
      <DesignSystemComponentPage
        activeComponent={morpheusSection.component}
        section={morpheusSection}
      >
        <div className="space-y-10">
          {morphPossibilityGroups.map((group) => (
            <section key={group.title}>
              <h2 className="font-semibold">{group.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/60">
                {group.subtitle}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.possibilities.map((possibility) => (
                  <MorpheusPossibilityDemo
                    key={`${possibility.title}-${possibility.direction}-${possibility.anchor ?? "default"}-${possibility.spring}`}
                    possibility={possibility}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </DesignSystemComponentPage>
    </AppShell>
  );
}
