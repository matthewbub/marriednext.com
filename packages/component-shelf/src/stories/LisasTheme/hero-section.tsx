"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src="/romantic-vineyard-wedding-venue-at-golden-hour-wit.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2c2c]/30 via-[#2c2c2c]/20 to-[#faf9f6]" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-white/90 tracking-[0.4em] uppercase text-sm mb-6">We're Getting Married</p>

        <h1 className="font-serif text-white">
          <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic mb-2">Yulissa</span>
          <span className="block text-2xl md:text-3xl tracking-[0.5em] uppercase font-sans font-light my-6">&</span>
          <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic">Matthew</span>
        </h1>

        <div className="mt-12 flex items-center justify-center gap-8 text-white/90">
          <span className="w-16 h-px bg-white/40" />
          <p className="tracking-[0.3em] uppercase text-sm">April 23, 2026</p>
          <span className="w-16 h-px bg-white/40" />
        </div>

        <p className="mt-4 text-white/80 tracking-[0.2em] uppercase text-sm">Temecula, California</p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[#2c2c2c]/60 text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#2c2c2c]/40 to-transparent" />
      </div>
    </section>
  )
}
