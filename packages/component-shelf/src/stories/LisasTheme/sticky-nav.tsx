"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Our Story", href: "#story" },
  { label: "Details", href: "#details" },
  { label: "Gallery", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
]

export function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)

      const sections = navItems.map((item) => item.href.slice(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-[#faf9f6]/95 backdrop-blur-sm py-4 border-b border-[#745656]/10" : "bg-transparent py-6",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-12">
        {navItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-base tracking-[0.2em] uppercase transition-colors duration-300",
              activeSection === item.href.slice(1) ? "text-[#745656]" : "text-[#2c2c2c]/70 hover:text-[#745656]",
            )}
          >
            {item.label}
            {activeSection === item.href.slice(1) && (
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#745656]" />
            )}
          </a>
        ))}
      </div>
    </nav>
  )
}
