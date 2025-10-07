import { useRef, useEffect, useCallback } from "react";

interface UseDebouncedTelemetryOptions {
  delay?: number; // milliseconds
}

/**
 * Hook for debounced telemetry tracking
 *
 * Delays tracking events to filter out rapid clicks and exploratory behavior.
 * This ensures we only capture meaningful user interactions rather than
 * accidental clicks or users testing features.
 *
 * @param options - Configuration options
 * @param options.delay - Delay in milliseconds before tracking (default: 3000ms)
 *
 * @returns Object with tracking functions:
 *  - `trackEvent`: Tracks user interactions with debouncing (cancels previous pending events)
 *  - `trackOnMount`: Tracks component mount once after delay (useful for default state tracking)
 *  - `trackImmediate`: Tracks event immediately without debouncing
 *
 * @example
 * ```tsx
 * import { useDebouncedTelemetry } from '@/hooks/useDebouncedTelemetry';
 * import { telemetry } from '@/lib/telemetry';
 *
 * function MyComponent() {
 *   const { trackEvent, trackOnMount } = useDebouncedTelemetry({ delay: 3000 });
 *
 *   // Track on component mount after 3 seconds (only users who stay)
 *   useEffect(() => {
 *     trackOnMount(() => telemetry.trackComponentMount());
 *   }, []);
 *
 *   // Track user action after 3 seconds of inactivity
 *   return (
 *     <button onClick={() => trackEvent(() => telemetry.trackButtonClick('expanded'))}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useDebouncedTelemetry(
  options: UseDebouncedTelemetryOptions = {}
) {
  const { delay = 3000 } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMountTrackedRef = useRef(false);

  /**
   * Track an event after the debounce delay
   * Cancels any previous pending events
   */
  const trackEvent = useCallback(
    (eventFn: () => void) => {
      // Clear any pending event
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Also cancel the mount event since user has interacted
      if (mountTimeoutRef.current && !hasMountTrackedRef.current) {
        clearTimeout(mountTimeoutRef.current);
        mountTimeoutRef.current = null;
      }

      // Schedule new event
      timeoutRef.current = setTimeout(() => {
        eventFn();
      }, delay);
    },
    [delay]
  );

  /**
   * Track an event on component mount after the debounce delay
   * Only fires once, even if called multiple times
   */
  const trackOnMount = useCallback(
    (eventFn: () => void) => {
      if (mountTimeoutRef.current) return; // Already scheduled

      mountTimeoutRef.current = setTimeout(() => {
        if (!hasMountTrackedRef.current) {
          eventFn();
          hasMountTrackedRef.current = true;
        }
      }, delay);
    },
    [delay]
  );

  /**
   * Track an event immediately without debouncing
   */
  const trackImmediate = useCallback((eventFn: () => void) => {
    eventFn();
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
        mountTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    trackEvent,
    trackOnMount,
    trackImmediate,
  };
}
