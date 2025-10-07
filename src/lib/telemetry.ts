// Client-side telemetry helper
// Session ID tracks a single browser session for analytics (not user authentication)

let sessionId: string | null = null;

// Generate or retrieve session ID for this browser session
function getSessionId(): string {
  if (sessionId) return sessionId;

  // Check if session ID exists in sessionStorage
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("telemetry_session_id");
    if (stored) {
      sessionId = stored;
      return stored;
    }

    // Generate new session ID for this browser session
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    sessionStorage.setItem("telemetry_session_id", newSessionId);
    sessionId = newSessionId;
    return newSessionId;
  }

  return "unknown";
}

export interface TelemetryEvent {
  componentName: string;
  eventType: string;
  eventValue?: string;
}

export async function trackEvent(event: TelemetryEvent): Promise<void> {
  try {
    const sessionId = getSessionId();

    await fetch("/api/zz/v1/telementary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        sessionId,
      }),
    });
  } catch (error) {
    console.error("Failed to track telemetry event:", error);
  }
}

// Specific tracking functions
export const telemetry = {
  trackGuestListViewToggle: (viewMode: "expanded" | "condensed") => {
    trackEvent({
      componentName: "GuestListDisplay",
      eventType: "view_mode_toggle",
      eventValue: viewMode,
    });
  },
  trackGuestListComponentMount: () => {
    trackEvent({
      componentName: "GuestListDisplay",
      eventType: "component_mount",
      eventValue: "expanded", // default view
    });
  },
};
