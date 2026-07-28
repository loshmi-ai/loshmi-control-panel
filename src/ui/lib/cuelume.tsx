import { useEffect } from "react";
import { useLocation } from "react-router";

export enum CuelumeSound {
  Bloom = "bloom",
  Chime = "chime",
  Droplet = "droplet",
  Error = "error",
  Loading = "loading",
  Page = "page",
  Press = "press",
  Ready = "ready",
  Release = "release",
  Sparkle = "sparkle",
  Success = "success",
  Tick = "tick",
  Toggle = "toggle",
  Whisper = "whisper",
}

export function CuelumeBinding() {
  const location = useLocation();

  useEffect(() => {
    let isActive = true;

    void import("cuelume").then(({ bind }) => {
      if (isActive) {
        bind();
      }
    });

    return () => {
      isActive = false;
    };
  }, [location.key]);

  return null;
}
