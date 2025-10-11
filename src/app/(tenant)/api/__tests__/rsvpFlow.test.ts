import { describe, it, expect } from "vitest";
import { validateGuest, getCompanionName } from "@/lib/tenant/guestList";
import { transition, submitName, type RsvpState } from "@/lib/tenant/rsvpFlow";

describe("RSVP Flow", () => {
  it("goes to error when name not found", async () => {
    const initial: RsvpState = { step: "name-input" };
    const next = await submitName(initial, "Not A Guest", (name) => ({
      guestType: validateGuest(name),
    }));
    expect(next.step).toBe("error");
    if (next.step === "error") {
      expect(next.message).toMatch("couldn't find your name");
    }
  });

  it("GUEST_ONLY: attend -> success", async () => {
    const initial: RsvpState = { step: "name-input" };
    const afterName = await submitName(initial, "Hunter", (name) => ({
      guestType: validateGuest(name),
    }));
    expect(afterName.step).toBe("attendance-question");
    const afterAttend = transition(afterName, {
      type: "AttendanceAnswered",
      canAttend: true,
    });
    expect(afterAttend.step).toBe("success");
  });

  it("GUEST_ONLY: cannot attend -> success (not attending)", async () => {
    const initial: RsvpState = { step: "name-input" };
    const afterName = await submitName(initial, "Hunter", (name) => ({
      guestType: validateGuest(name),
    }));
    const afterAttend = transition(afterName, {
      type: "AttendanceAnswered",
      canAttend: false,
    });
    expect(afterAttend.step).toBe("success");
    if (afterAttend.step === "success") {
      expect(afterAttend.message).toMatch("can't make it");
    }
  });

  it("GUEST_PLUSONE_INVITED: attend -> ask plus one -> success yes", async () => {
    const initial: RsvpState = { step: "name-input" };
    const afterName = await submitName(initial, "Tyler", (name) => ({
      guestType: validateGuest(name),
    }));
    expect(afterName.step).toBe("attendance-question");
    const plusOneQ = transition(afterName, {
      type: "AttendanceAnswered",
      canAttend: true,
    });
    expect(plusOneQ.step).toBe("plus-one-question");
    const done = transition(plusOneQ, {
      type: "PlusOneAnswered",
      hasPlusOne: true,
    });
    expect(done.step).toBe("success");
    if (done.step === "success") {
      expect(done.message).toMatch("plus one");
    }
  });

  it("GUEST_AND_KNOWN_PLUSONE: attend -> ask about known companion -> success paths", async () => {
    const initial: RsvpState = { step: "name-input" };
    const afterName = await submitName(initial, "Shayna", (name) => ({
      guestType: validateGuest(name),
      companionName: getCompanionName(name),
    }));
    expect(afterName.step).toBe("attendance-question");
    const ask = transition(afterName, {
      type: "AttendanceAnswered",
      canAttend: true,
    });
    expect(ask.step).toBe("known-companion-question");
    const yes = transition(ask, {
      type: "KnownCompanionAnswered",
      companionAttending: true,
    });
    expect(yes.step).toBe("success");
    if (yes.step === "success") expect(yes.message).toMatch("See you both");
    const no = transition(ask, {
      type: "KnownCompanionAnswered",
      companionAttending: false,
    });
    expect(no.step).toBe("success");
    if (no.step === "success") expect(no.message).not.toMatch("both");
  });

  it("Back from plus-one -> attendance-question", async () => {
    const initial: RsvpState = { step: "name-input" };
    const afterName = await submitName(initial, "Tyler", (name) => ({
      guestType: validateGuest(name),
    }));
    const plusOneQ = transition(afterName, {
      type: "AttendanceAnswered",
      canAttend: true,
    });
    const back = transition(plusOneQ, { type: "Back" });
    expect(back.step).toBe("attendance-question");
  });
});
