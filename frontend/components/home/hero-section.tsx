"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#0a192f] flex items-center">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-[#2FA8CC]/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#1F4E79]/40 blur-[100px]" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-[#FF6B00]/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center lg:py-44">
        {/* Floating badge */}
        <div
          className={`mb-8 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227] backdrop-blur-sm transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Since 2024 · Savardhat, Goa
        </div>

        {/* Logo with glow ring */}
        <div
          className={`mb-10 relative transition-all duration-700 ${mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="absolute inset-0 rounded-full bg-[#2FA8CC]/30 blur-2xl scale-150" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm ring-1 ring-[#C9A227]/20 animate-float">
            <Image
              src="/logo.jpeg"
              alt="P.P.E.S. Logo"
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`max-w-5xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "350ms", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          Prarambha Path{" "}
          <span className="relative inline-block">
            <span className="text-[#FF6B00]">Evening School</span>
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#C9A227] opacity-70" />
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`mt-5 text-xl font-medium tracking-wide text-white/70 md:text-2xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "450ms" }}
        >
          The Initial Path Towards Holistic Success
        </p>

        {/* Description */}
        <p
          className={`mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/50 md:text-lg transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "550ms" }}
        >
          A student-led evening school transforming rural education in Savardhat
          through practical learning, Gurukul values, and leadership.
        </p>

        {/* Location pill */}
        <div
          className={`mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/50 border border-white/10 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "620ms" }}
        >
          <MapPin className="h-4 w-4 text-[#FF6B00]" />
          Savardhat Village, Bicholim Taluka, Goa
        </div>

        {/* CTAs */}
        <div
          className={`mt-12 flex flex-col gap-4 sm:flex-row transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "700ms" }}
        >
          <Link
            href="#vision"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02]"
          >
            Explore Our Vision
          </Link>
          <Link
            href="#connect"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#e05a00] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-[#FF6B00]/30 transition-all duration-300 hover:shadow-[#FF6B00]/50 hover:scale-[1.03] active:scale-[0.98]"
          >
            Join the Movement
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/50 flex items-start justify-center pt-1">
            <div className="h-2 w-0.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
