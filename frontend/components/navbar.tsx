"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "/faculties", label: "Acharya Mandal" },
  { href: "#journey", label: "Journey" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-navy/90 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-navy/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-gold/50 transition-all duration-300">
            <Image
              src="/logo.jpeg"
              alt="P.P.E.S. Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white">P.P.E.S.</span>
            <span className="text-[10px] text-white/40 font-medium tracking-wider">Since 2024</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-gold" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Join Us CTA */}
        <Link
          href="/join"
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-[#e55f00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-saffron/25 transition-all duration-200 hover:shadow-saffron/40 hover:scale-[1.03] active:scale-[0.98]"
        >
          Join Us
        </Link>

        {/* Mobile Toggle */}
        <button
          className="inline-flex items-center justify-center rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "border-t border-white/10 bg-navy/95 backdrop-blur-xl md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-white/10 text-white border-l-2 border-gold"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setMobileOpen(false)}
            className="mt-3 rounded-xl bg-gradient-to-r from-saffron to-[#e55f00] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-saffron/20"
          >
            Join Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
