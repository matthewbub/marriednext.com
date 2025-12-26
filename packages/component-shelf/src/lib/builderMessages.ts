export type BuilderMessageType =
  | "SECTION_CLICKED"
  | "LABEL_CLICKED"
  | "DESELECT"
  | "UPDATE_LABEL"
  | "REFRESH_PREVIEW";

export type SectionClickedPayload = {
  sectionId: string;
  sectionName: string;
};

export type LabelClickedPayload = {
  sectionId: string;
  labelKey: string;
  currentValue: string;
};

export type UpdateLabelPayload = {
  sectionId: string;
  labelKey: string;
  value: string;
};

export type BuilderMessage =
  | { type: "SECTION_CLICKED"; payload: SectionClickedPayload }
  | { type: "LABEL_CLICKED"; payload: LabelClickedPayload }
  | { type: "DESELECT" }
  | { type: "UPDATE_LABEL"; payload: UpdateLabelPayload }
  | { type: "REFRESH_PREVIEW" };

export const BUILDER_MESSAGE_SOURCE = "marriednext-builder";

export function postToParent(message: BuilderMessage) {
  if (typeof window !== "undefined" && window.parent !== window) {
    window.parent.postMessage(
      { source: BUILDER_MESSAGE_SOURCE, ...message },
      "*"
    );
  }
}

export function postToIframe(
  iframe: HTMLIFrameElement,
  message: BuilderMessage
) {
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { source: BUILDER_MESSAGE_SOURCE, ...message },
      "*"
    );
  }
}

export function isBuilderMessage(
  event: MessageEvent
): event is MessageEvent<BuilderMessage & { source: string }> {
  return event.data?.source === BUILDER_MESSAGE_SOURCE;
}
