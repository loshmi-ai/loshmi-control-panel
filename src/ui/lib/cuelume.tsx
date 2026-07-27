import { useEffect } from "react";
import { useLocation } from "react-router";

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
