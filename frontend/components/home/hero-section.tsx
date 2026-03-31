"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  { value: "50+", label: "Students" },
  { value: "16", label: "Volunteer Teachers" },
  { value: "2024", label: "Founded" },
  { value: "4", label: "Young Founders" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-navy flex flex-col">
      {/* === Background layer === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glows */}
        <div className="absolute top-0 left-1/4 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-sky/10 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] translate-x-1/2 translate-y-1/3 rounded-full bg-saffron/8 blur-[140px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* === Main content === */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-12 text-center">

        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gold transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "80ms" }}
        >
          <Sparkles className="h-3 w-3" />
          Since 2024 · Savardhat, Goa
        </div>

        {/* Logo */}
        <div
          className={`mb-7 relative transition-all duration-700 ${mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="absolute inset-0 rounded-full bg-sky/25 blur-2xl scale-[1.6]" />
          <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm ring-1 ring-gold/15 animate-float">
            <Image src="/logo.jpeg" alt="P.P.E.S. Logo" width={88} height={88} className="rounded-full" priority />
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`max-w-4xl font-display text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "280ms" }}
        >
          Prarambha Path
          <br />
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-saffron via-orange-400 to-saffron bg-clip-text text-transparent">
              Evening School
            </span>
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`mt-4 text-base font-medium tracking-wide text-white/55 sm:text-lg md:text-xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "360ms" }}
        >
          The Initial Path Towards Holistic Success
        </p>

        {/* Location pill */}
        <div
          className={`mt-3 inline-flex items-center gap-1.5 text-xs text-white/35 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: "420ms" }}
        >
          <MapPin className="h-3.5 w-3.5 text-saffron/60" />
          Savardhat Village, Bicholim, Goa
        </div>

        {/* CTAs */}
        <div
          className={`mt-9 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          style={{ transitionDelay: "500ms" }}
        >
          <Link
            href="#about"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/12"
          >
            Our Story
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-saffron/20 transition-all duration-300 hover:shadow-saffron/35 hover:scale-[1.02]"
          >
            Join the Movement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* === Stats bar === */}
      <div
        className={`relative z-10 w-full border-t border-white/8 bg-white/4 backdrop-blur-sm transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ transitionDelay: "640ms" }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-white/8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-5 px-4">
              <span className="font-display text-xl font-bold text-white sm:text-2xl">{s.value}</span>
              <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/35">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
