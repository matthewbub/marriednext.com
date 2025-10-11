import type {
  GuestType,
  RsvpState,
  NameValidationResult,
  NameValidator,
  RsvpEvent,
} from "./types";

export type { RsvpState, NameValidationResult, NameValidator, RsvpEvent };

const NOT_FOUND_MESSAGE =
  "Sorry, we couldn't find your name on our guest list. If you think this is a mistake, please reach out and let us know! 💝";

function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.length === 0
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export function transition(state: RsvpState, event: RsvpEvent): RsvpState {
  switch (event.type) {
    case "NameValidated": {
      if (event.guestType === "UNKNOWN") {
        return { step: "error", message: NOT_FOUND_MESSAGE };
      }
      return {
        step: "attendance-question",
        guestType: event.guestType,
        name: toTitleCase(event.name),
        companionName: event.companionName
          ? toTitleCase(event.companionName)
          : undefined,
      };
    }
    case "AttendanceAnswered": {
      if (state.step !== "attendance-question") return state;
      const { name, guestType } = state;
      if (!event.canAttend) {
        return {
          step: "success",
          message: `Thanks, ${name}. We've recorded that you can't make it. We'll miss you! 💝`,
        };
      }
      if (guestType === "GUEST_PLUSONE_INVITED") {
        return {
          step: "plus-one-question",
          guestType: "GUEST_PLUSONE_INVITED",
          name,
        };
      }
      if (guestType === "GUEST_AND_KNOWN_PLUSONE") {
        return state.companionName
          ? {
              step: "known-companion-question",
              guestType: "GUEST_AND_KNOWN_PLUSONE",
              name,
              companionName: state.companionName,
            }
          : {
              step: "known-companion-question",
              guestType: "GUEST_AND_KNOWN_PLUSONE",
              name,
              companionName: "your companion",
            };
      }
      return {
        step: "success",
        message: `Perfect! Thanks ${name}. We've got your RSVP. See you there! ✨`,
      };
    }
    case "PlusOneAnswered": {
      if (state.step !== "plus-one-question") return state;
      const { name } = state;
      return {
        step: "success",
        message: event.hasPlusOne
          ? `Awesome! Thanks ${name}. We've got your RSVP for you and your plus one. See you both there! ✨`
          : `Perfect! Thanks ${name}. We've got your RSVP. See you there! ✨`,
      };
    }
    case "KnownCompanionAnswered": {
      if (state.step !== "known-companion-question") return state;
      const { name, companionName } = state;
      return {
        step: "success",
        message: event.companionAttending
          ? `Perfect! Thanks ${name}. We've got your RSVP for you and ${companionName}. See you both there! ✨`
          : `Perfect! Thanks ${name}. We've got your RSVP. See you there! ✨`,
      };
    }
    case "Back": {
      if (state.step === "plus-one-question") {
        return {
          step: "attendance-question",
          guestType: "GUEST_PLUSONE_INVITED",
          name: state.name,
        };
      }
      if (state.step === "known-companion-question") {
        return {
          step: "attendance-question",
          guestType: "GUEST_AND_KNOWN_PLUSONE",
          name: state.name,
          companionName: state.companionName,
        };
      }
      if (state.step === "attendance-question") {
        return { step: "name-input" };
      }
      return state;
    }
    case "Reset":
      return { step: "name-input" };
    default:
      return state;
  }
}

export async function submitName(
  state: RsvpState,
  name: string,
  validateName: NameValidator
): Promise<RsvpState> {
  if (state.step !== "name-input") return state;
  try {
    const { guestType, companionName } = await Promise.resolve(
      validateName(name.trim())
    );
    return transition(state, {
      type: "NameValidated",
      name: name.trim(),
      guestType,
      companionName,
    });
  } catch (error) {
    return {
      step: "error",
      message:
        error instanceof Error ? error.message : "Failed to check guest list",
    };
  }
}
