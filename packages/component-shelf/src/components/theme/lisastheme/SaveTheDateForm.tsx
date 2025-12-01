"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ArrowRight, Check, Calendar, MapPin, Heart } from "lucide-react";

// These would come from the wedding settings in a real app
const weddingConfig = {
  coupleName: "Yulissa & Matthew",
  weddingDate: "April 23, 2026",
  location: "Temecula, California",
  venue: "Ponte Winery",
  websiteUrl: "yulissaandmatthew.com",
  collectEmail: true,
  collectPhone: true,
  collectAddress: true,
  collectDietaryRestrictions: true,
  collectMessage: true,
};

export function SaveTheDateForm() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"intro" | "form" | "confirmed">("intro");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dietaryRestrictions: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/romantic-vineyard-wedding-venue-at-golden-hour-wit.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2c2c2c]/40 via-[#2c2c2c]/30 to-[#faf9f6]" />
        </div>

        <div
          className={`relative z-10 text-center px-6 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-white/90 tracking-[0.4em] uppercase text-sm mb-6">
            Save the Date
          </p>

          <h1 className="font-serif text-white">
            <span className="block text-6xl md:text-7xl lg:text-8xl font-light italic mb-2">
              Yulissa
            </span>
            <span className="block text-2xl tracking-[0.5em] uppercase font-sans font-light my-4">
              &
            </span>
            <span className="block text-6xl md:text-7xl lg:text-8xl font-light italic">
              Matthew
            </span>
          </h1>

          <div className="mt-10 flex items-center justify-center gap-6 text-white/90">
            <span className="w-12 h-px bg-white/40" />
            <p className="tracking-[0.3em] uppercase text-sm">
              {weddingConfig.weddingDate}
            </p>
            <span className="w-12 h-px bg-white/40" />
          </div>

          <p className="mt-3 text-white/80 tracking-[0.2em] uppercase text-sm">
            {weddingConfig.location}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          {step === "intro" && (
            <div
              className={`text-center transition-all duration-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Heart className="w-8 h-8 text-[#745656] mx-auto mb-6" />
              <h2 className="font-serif text-4xl md:text-5xl text-[#2c2c2c] font-light italic mb-6">
                We're Getting Married!
              </h2>
              <p className="text-[#2c2c2c]/70 text-lg leading-relaxed mb-4">
                We would be honored to have you join us as we celebrate our
                love.
              </p>
              <p className="text-[#2c2c2c]/70 text-lg leading-relaxed mb-10">
                Please save the date and let us know where to send your formal
                invitation.
              </p>

              {/* Event Details */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8 border-y border-[#745656]/20 mb-10">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#745656]" />
                  <span className="text-[#2c2c2c] tracking-wide">
                    {weddingConfig.weddingDate}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#745656]/20" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#745656]" />
                  <span className="text-[#2c2c2c] tracking-wide">
                    {weddingConfig.venue}, {weddingConfig.location}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setStep("form")}
                className="h-14 px-12 bg-[#745656] hover:bg-[#5d4545] text-white tracking-[0.2em] uppercase text-sm"
              >
                Save the Date
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === "form" && (
            <div>
              <div className="text-center mb-12">
                <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
                  Save the Date
                </p>
                <h2 className="font-serif text-4xl text-[#2c2c2c] font-light italic mb-4">
                  Your Information
                </h2>
                <p className="text-[#2c2c2c]/70">
                  Please provide your details so we can send your formal
                  invitation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Fields */}
                <div className="space-y-6">
                  <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase border-b border-[#745656]/20 pb-2">
                    Name
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Fields */}
                {(weddingConfig.collectEmail || weddingConfig.collectPhone) && (
                  <div className="space-y-6">
                    <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase border-b border-[#745656]/20 pb-2">
                      Contact
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {weddingConfig.collectEmail && (
                        <div>
                          <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                          />
                        </div>
                      )}
                      {weddingConfig.collectPhone && (
                        <div>
                          <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mailing Address */}
                {weddingConfig.collectAddress && (
                  <div className="space-y-6">
                    <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase border-b border-[#745656]/20 pb-2">
                      Mailing Address
                    </p>
                    <p className="text-[#2c2c2c]/50 text-sm -mt-2">
                      For your formal invitation
                    </p>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                          Street Address
                        </label>
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="col-span-2">
                          <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                            City
                          </label>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                          />
                        </div>
                        <div>
                          <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                            State
                          </label>
                          <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                          />
                        </div>
                        <div>
                          <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                            ZIP
                          </label>
                          <Input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {(weddingConfig.collectDietaryRestrictions ||
                  weddingConfig.collectMessage) && (
                  <div className="space-y-6">
                    <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase border-b border-[#745656]/20 pb-2">
                      Additional Information
                    </p>
                    {weddingConfig.collectDietaryRestrictions && (
                      <div>
                        <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                          Dietary Restrictions or Allergies
                        </label>
                        <Input
                          type="text"
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={handleInputChange}
                          placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                          className="h-12 text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0 placeholder:text-[#2c2c2c]/30"
                        />
                      </div>
                    )}
                    {weddingConfig.collectMessage && (
                      <div>
                        <label className="block text-[#2c2c2c]/70 text-sm mb-2">
                          Message for the Couple
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Share your well wishes..."
                          rows={4}
                          className="text-base bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 px-0 resize-none placeholder:text-[#2c2c2c]/30"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("intro")}
                    className="text-[#2c2c2c]/60 hover:text-[#2c2c2c] hover:bg-transparent tracking-[0.1em] uppercase text-sm"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="h-14 px-12 bg-[#745656] hover:bg-[#5d4545] text-white tracking-[0.2em] uppercase text-sm"
                  >
                    Submit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === "confirmed" && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#745656]/10 mb-8">
                <Check className="w-10 h-10 text-[#745656]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#2c2c2c] font-light italic mb-4">
                Thank You, {formData.firstName}!
              </h2>
              <p className="text-[#2c2c2c]/70 text-lg leading-relaxed mb-8">
                We've saved your information and can't wait to celebrate with
                you.
                <br />
                Your formal invitation will be on its way soon.
              </p>

              <div className="py-8 border-y border-[#745656]/20 mb-8">
                <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase mb-3">
                  Mark Your Calendar
                </p>
                <p className="font-serif text-3xl text-[#2c2c2c] italic">
                  {weddingConfig.weddingDate}
                </p>
                <p className="text-[#2c2c2c]/70 mt-2">
                  {weddingConfig.venue}, {weddingConfig.location}
                </p>
              </div>

              <p className="text-[#2c2c2c]/60 text-sm">
                Visit our wedding website for more details:
                <br />
                <a
                  href={`https://${weddingConfig.websiteUrl}`}
                  className="text-[#745656] hover:underline font-medium"
                >
                  {weddingConfig.websiteUrl}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-[#745656]/10">
        <p className="font-serif text-2xl text-[#2c2c2c] italic">
          {weddingConfig.coupleName}
        </p>
        <p className="text-[#2c2c2c]/50 text-sm mt-2 tracking-wide">
          {weddingConfig.weddingDate}
        </p>
      </footer>
    </div>
  );
}
