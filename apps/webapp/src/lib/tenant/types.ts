import { ReactNode } from "react";

export type ObjectPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface PhotoWithPosition {
  url: string;
  objectPosition?: ObjectPosition;
}

export type PhotoType = string | PhotoWithPosition;

export interface PhotoFrameProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "photo" | "square" | "wide" | "horizontal";
  objectPosition?: ObjectPosition;
}

export interface TimelineCardProps {
  year: string;
  children: ReactNode;
  isLast?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type GuestType =
  | "GUEST_PLUSONE_INVITED"
  | "GUEST_ONLY"
  | "GUEST_AND_KNOWN_PLUSONE"
  | "UNKNOWN";

export type RsvpState =
  | { step: "name-input" }
  | {
      step: "attendance-question";
      guestType: GuestType;
      name: string;
      companionName?: string;
    }
  | {
      step: "plus-one-question";
      guestType: "GUEST_PLUSONE_INVITED";
      name: string;
    }
  | {
      step: "known-companion-question";
      guestType: "GUEST_AND_KNOWN_PLUSONE";
      name: string;
      companionName: string;
    }
  | { step: "success"; message: string }
  | { step: "error"; message: string };

export type NameValidationResult = {
  guestType: GuestType;
  companionName?: string;
};

export type NameValidator = (
  name: string
) => Promise<NameValidationResult> | NameValidationResult;

export type RsvpEvent =
  | {
      type: "NameValidated";
      name: string;
      guestType: GuestType;
      companionName?: string;
    }
  | { type: "AttendanceAnswered"; canAttend: boolean }
  | { type: "PlusOneAnswered"; hasPlusOne: boolean }
  | { type: "KnownCompanionAnswered"; companionAttending: boolean }
  | { type: "Back" }
  | { type: "Reset" };

export type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownProps = {
  targetUtcIso?: string;
  labels: CountdownLabels;
};

export type GSAPTimelineLike = {
  fromTo: (
    target: Element | Element[] | null,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: string
  ) => GSAPTimelineLike;
  to: (
    target: Element | Element[] | null,
    toVars: Record<string, unknown>,
    position?: string
  ) => GSAPTimelineLike;
  kill?: () => void;
};

export type GSAPLike = {
  set: (
    target: Element | Element[] | null,
    vars: Record<string, unknown>
  ) => void;
  timeline: (vars?: Record<string, unknown>) => GSAPTimelineLike;
};

export type NavLink = {
  href: string;
  label: string;
};

export type MobileSidenavProps = {
  navLinks: NavLink[];
  getNavItemClass: (href: string) => string;
  ariaLabel: string;
};

export interface ComingSoonProps {
  title?: string;
  message?: string;
  backHref?: string;
  className?: string;
}
