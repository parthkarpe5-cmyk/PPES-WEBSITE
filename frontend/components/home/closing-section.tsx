"use client"

import Link from "next/link"
import { Mail, MapPin, Quote, MessageSquare, UserPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const socialLinks = [
  {
    label: "YouTube",
    href: "https://youtube.com/@prarambhapath?si=wQcjubXc9SCucgBF",
    bg: "bg-red-600",
    hoverGlow: "hover:shadow-red-500/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/prarambha_path",
    bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    hoverGlow: "hover:shadow-pink-500/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/20Ah469M6xBubEMBiBZt3Y?si=lYsRyCnkQF6D5QFA04briA",
    bg: "bg-green-500",
    hoverGlow: "hover:shadow-green-500/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
]

export function ClosingSection() {
  const topRef = useRef<HTMLDivElement>(null)
  const [topVisible, setTopVisible] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)
  const [quoteVisible, setQuoteVisible] = useState(false)

  useEffect(() => {
    const obs1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTopVisible(true) }, { threshold: 0.2 })
    const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setQuoteVisible(true) }, { threshold: 0.2 })
    if (topRef.current) obs1.observe(topRef.current)
    if (quoteRef.current) obs2.observe(quoteRef.current)
    return () => { obs1.disconnect(); obs2.disconnect() }
  }, [])

  return (
    <section id="connect" className="relative bg-white py-28 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-light-blue/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div
          ref={topRef}
          className={`text-center transition-all duration-700 ${topVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-sky">Get In Touch</span>
          <h2
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-deep-blue md:text-5xl font-display"
          >
            Let&apos;s Build Something{" "}
            <span className="relative">
              Meaningful Together
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-gold to-[#f0d074] opacity-70" />
            </span>
          </h2>
          <div className="gold-divider mx-auto mt-5" />
        </div>

        {/* Location + CTAs */}
        <div
          className={`mt-14 transition-all duration-700 delay-100 ${topVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Location chip */}
          <div className="mx-auto mb-10 flex max-w-xs items-center justify-center gap-3 rounded-2xl border border-border bg-light-blue/50 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 shrink-0">
              <MapPin className="h-5 w-5 text-sky" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sky uppercase tracking-wide">Location</p>
              <p className="mt-0.5 text-sm text-deep-blue font-medium">Savardhat Village, Bicholim, Goa</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-sky bg-white px-8 py-5 font-semibold text-deep-blue transition-all duration-300 hover:bg-sky hover:text-white hover:shadow-xl hover:shadow-sky/25 hover:scale-[1.02] sm:w-auto sm:min-w-[220px]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/10 group-hover:bg-white/20 transition-colors">
                <MessageSquare className="h-5 w-5 text-sky group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">Contact Us</p>
                <p className="mt-1 text-xs font-normal opacity-70">Send us a message</p>
              </div>
            </Link>

            <Link
              href="/join"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-saffron to-orange-600 px-8 py-5 font-semibold text-white shadow-xl shadow-saffron/30 transition-all duration-300 hover:shadow-saffron/50 hover:scale-[1.02] sm:w-auto sm:min-w-[220px]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 group-hover:bg-white/25 transition-colors">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">Join Us</p>
                <p className="mt-1 text-xs font-normal opacity-80">Become a part of PPES</p>
              </div>
            </Link>
          </div>

          {/* Email chip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:prarambhpath4444@gmail.com"
              className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-sky/40 hover:text-sky hover:shadow-md hover:shadow-sky/10 hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" />
              prarambhpath4444@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-sky">Follow Us</p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`group flex items-center gap-2.5 rounded-2xl ${s.bg} px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.05] hover:shadow-xl ${s.hoverGlow}`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Final quote banner */}
        <div
          ref={quoteRef}
          className={`mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-deep-blue to-sky px-8 py-16 text-center md:px-16 transition-all duration-700 ${quoteVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Orbs */}
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <Quote className="mx-auto h-10 w-10 text-gold" />
            <blockquote
              className="mx-auto mt-6 max-w-3xl text-2xl font-bold leading-relaxed text-white md:text-4xl font-display"
            >
              &ldquo;Education must shape character before careers.&rdquo;
            </blockquote>
            <div className="gold-divider mx-auto mt-6" />
            <p className="mt-5 text-sm font-medium text-white/50">
              Prarambha Path Evening School · Since 2024
            </p>

            {/* Social pills inside banner */}
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
