import { useCallback } from "react";

export function useTelemetry() {
  const track = useCallback((eventFn: () => void) => {
    eventFn();
  }, []);

  return {
    track,
  };
}
