"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarHeart, Check, X, Users, Pencil, RotateCcw, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import gsap from "gsap"

type DemoGuest = {
  id: string
  name: string
  isAttending: boolean | null
  dietaryRestrictions: string
  hasPlusOne: boolean
  plusOneName: string
  plusOneAttending: boolean | null
}

export function SaveTheDateSection() {
  const [demoStep, setDemoStep] = useState<"intro" | "form" | "success">("intro")
  const [guests, setGuests] = useState<DemoGuest[]>([
    {
      id: "1",
      name: "You",
      isAttending: null,
      dietaryRestrictions: "",
      hasPlusOne: true,
      plusOneName: "",
      plusOneAttending: null,
    },
    {
      id: "2",
      name: "Your Partner",
      isAttending: null,
      dietaryRestrictions: "",
      hasPlusOne: false,
      plusOneName: "",
      plusOneAttending: null,
    },
  ])

  const guestDetailsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const plusOneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const prevGuestStates = useRef<{ [key: string]: boolean | null }>({})
  const initializedRefs = useRef<{ [key: string]: boolean }>({})

  const handleGuestResponse = (guestId: string, field: keyof DemoGuest, value: any) => {
    const guest = guests.find((g) => g.id === guestId)

    if (field === "isAttending" && guest) {
      prevGuestStates.current[guestId] = guest.isAttending
    }

    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, [field]: value } : g)))
  }

  useEffect(() => {
    guests.forEach((guest) => {
      const detailsEl = guestDetailsRefs.current[guest.id]
      const plusOneEl = plusOneRefs.current[guest.id]

      if (detailsEl && !initializedRefs.current[`details-${guest.id}`]) {
        gsap.set(detailsEl, { height: 0, opacity: 0, marginTop: 0, overflow: "hidden" })
        initializedRefs.current[`details-${guest.id}`] = true
      }
      if (plusOneEl && !initializedRefs.current[`plusone-${guest.id}`]) {
        gsap.set(plusOneEl, { height: 0, opacity: 0, marginTop: 0, overflow: "hidden" })
        initializedRefs.current[`plusone-${guest.id}`] = true
      }

      const prevState = prevGuestStates.current[guest.id]

      if (detailsEl) {
        if (guest.isAttending === true && prevState !== true) {
          gsap.to(detailsEl, {
            height: "auto",
            opacity: 1,
            marginTop: 16,
            duration: 0.4,
            ease: "power2.out",
          })
        } else if (guest.isAttending !== true && prevState === true) {
          gsap.to(detailsEl, {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 0.3,
            ease: "power2.in",
          })
        }
      }

      if (plusOneEl && guest.hasPlusOne) {
        if (guest.isAttending === true && prevState !== true) {
          gsap.to(plusOneEl, {
            height: "auto",
            opacity: 1,
            marginTop: 12,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2,
          })
        } else if (guest.isAttending !== true && prevState === true) {
          gsap.to(plusOneEl, {
            height: 0,
            opacity: 0,
            marginTop: 0,
            duration: 0.3,
            ease: "power2.in",
          })
        }
      }
    })
  }, [guests])

  const allResponded = guests.every((g) => g.isAttending !== null)
  const attendingCount =
    guests.filter((g) => g.isAttending).length +
    guests.filter((g) => g.isAttending && g.hasPlusOne && g.plusOneAttending).length

  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/30 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CalendarHeart className="h-4 w-4" />
              Try the RSVP Flow
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6 text-balance">
              See exactly what your guests experience
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              This is an interactive demo of the actual RSVP form your guests will use. Try it out — respond for
              multiple guests, add plus ones, and see how simple it is.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-medium text-primary text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Click "Try the Demo"</p>
                  <p className="text-sm text-muted-foreground">Start the interactive RSVP experience</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-medium text-primary text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Respond for each guest</p>
                  <p className="text-sm text-muted-foreground">Just like a real invitation with multiple guests</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-medium text-primary text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Add plus one details</p>
                  <p className="text-sm text-muted-foreground">If attending, you can bring a guest</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Don't worry — this is just a demo. You're not actually RSVPing to anything!
            </p>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-dashed border-primary/20 rounded-lg rotate-6" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-2 border-dashed border-primary/20 rounded-full" />

            <div className="absolute -top-8 right-8 text-primary/40 rotate-45">
              <Pencil className="h-8 w-8" />
            </div>

            <div
              className={cn(
                "relative bg-card rounded-2xl border-2 border-dashed border-primary/30 shadow-xl transition-transform duration-300",
                demoStep === "intro" ? "rotate-1" : "rotate-0",
              )}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800 uppercase tracking-wide">
                Interactive Demo
              </div>

              <div className="p-6 md:p-8">
                {demoStep === "intro" && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground mb-2">You're Invited!</h3>
                    <p className="text-muted-foreground mb-1">Demo Wedding</p>
                    <p className="text-sm text-muted-foreground mb-8">Someday, 2025 • A Beautiful Venue</p>

                    <div className="space-y-3 text-left mb-8 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-foreground">This invitation includes:</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>2 guests (You + Your Partner)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4" />
                        <span>Plus one option available</span>
                      </div>
                    </div>

                    <Button onClick={() => setDemoStep("form")} size="lg" className="w-full">
                      Try the Demo
                    </Button>
                  </div>
                )}

                {demoStep === "form" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="font-serif text-xl text-foreground">RSVP for Demo Wedding</h3>
                      <p className="text-sm text-muted-foreground">Please respond for each guest</p>
                    </div>

                    {guests.map((guest, index) => (
                      <div key={guest.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-dashed border-border" />}

                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{guest.name}</span>
                          {guest.isAttending !== null && (
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                guest.isAttending ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                              )}
                            >
                              {guest.isAttending ? "Attending" : "Not attending"}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={guest.isAttending === true ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleGuestResponse(guest.id, "isAttending", true)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={guest.isAttending === false ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleGuestResponse(guest.id, "isAttending", false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            No
                          </Button>
                        </div>

                        <div
                          ref={(el) => {
                            guestDetailsRefs.current[guest.id] = el
                          }}
                          style={{ height: 0, opacity: 0, overflow: "hidden", marginTop: 0 }}
                        >
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Dietary restrictions (optional)</Label>
                            <Textarea
                              value={guest.dietaryRestrictions}
                              onChange={(e) => handleGuestResponse(guest.id, "dietaryRestrictions", e.target.value)}
                              placeholder="Any allergies or restrictions..."
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>
                        </div>

                        {guest.hasPlusOne && (
                          <div
                            ref={(el) => {
                              plusOneRefs.current[guest.id] = el
                            }}
                            style={{ height: 0, opacity: 0, overflow: "hidden", marginTop: 0 }}
                          >
                            <div className="ml-4 pl-4 border-l-2 border-primary/20 space-y-3">
                              <p className="text-sm font-medium text-foreground">Plus One</p>
                              <Input
                                value={guest.plusOneName}
                                onChange={(e) => handleGuestResponse(guest.id, "plusOneName", e.target.value)}
                                placeholder="Guest name"
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={guest.plusOneAttending === true ? "default" : "outline"}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleGuestResponse(guest.id, "plusOneAttending", true)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Attending
                                </Button>
                                <Button
                                  type="button"
                                  variant={guest.plusOneAttending === false ? "default" : "outline"}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleGuestResponse(guest.id, "plusOneAttending", false)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Not coming
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button onClick={() => setDemoStep("success")} disabled={!allResponded} className="w-full">
                      Submit RSVP
                    </Button>

                    <button
                      onClick={() => setDemoStep("intro")}
                      className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Start over
                    </button>
                  </div>
                )}

                {demoStep === "success" && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
                      <PartyPopper className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground mb-2">You're all set!</h3>
                    <p className="text-muted-foreground mb-6">
                      {attendingCount > 0
                        ? `${attendingCount} guest${attendingCount > 1 ? "s" : ""} attending`
                        : "We'll miss you!"}
                    </p>

                    <div className="p-4 bg-muted/50 rounded-lg mb-6 text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Response summary</p>
                      {guests.map((guest) => (
                        <div key={guest.id} className="flex items-center justify-between py-1 text-sm">
                          <span className="text-foreground">{guest.name}</span>
                          <span className={guest.isAttending ? "text-green-600" : "text-red-600"}>
                            {guest.isAttending ? "Yes" : "No"}
                          </span>
                        </div>
                      ))}
                      {guests
                        .filter((g) => g.hasPlusOne && g.isAttending && g.plusOneName)
                        .map((guest) => (
                          <div key={`${guest.id}-plus`} className="flex items-center justify-between py-1 text-sm">
                            <span className="text-foreground">{guest.plusOneName || "Plus one"}</span>
                            <span className={guest.plusOneAttending ? "text-green-600" : "text-red-600"}>
                              {guest.plusOneAttending ? "Yes" : "No"}
                            </span>
                          </div>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground mb-6">This was just a demo — no real RSVP was sent!</p>

                    <Button onClick={() => setDemoStep("intro")} variant="outline" className="w-full bg-transparent">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
