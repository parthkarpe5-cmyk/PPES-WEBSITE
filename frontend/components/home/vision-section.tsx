"use client"

import { GraduationCap, Heart, Brain } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const pillars = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description:
      "Experiential and resource-based learning where the syllabus stays the same but students truly understand — not just memorize.",
    iconBg: "bg-sky/15",
    iconColor: "text-sky",
    border: "hover:border-sky/30",
    glow: "hover:shadow-sky/8",
    accent: "bg-sky",
  },
  {
    icon: Heart,
    title: "Inner Growth & Cultural Awareness",
    description:
      "Values rooted in Gurukul traditions — respect, self-discipline, cultural identity, and the strength to stand by one&apos;s roots.",
    iconBg: "bg-saffron/15",
    iconColor: "text-saffron",
    border: "hover:border-saffron/30",
    glow: "hover:shadow-saffron/8",
    accent: "bg-saffron",
  },
  {
    icon: Brain,
    title: "Leadership & Logical Reasoning",
    description:
      "Nurturing confident thinkers and decision-makers who can analyze, reason, and lead with clarity and character.",
    iconBg: "bg-gold/15",
    iconColor: "text-gold",
    border: "hover:border-gold/30",
    glow: "hover:shadow-gold/8",
    accent: "bg-gold",
  },
]

function PillarCard({ pillar, index }: { pillar: (typeof pillars)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`group relative flex flex-col rounded-3xl border border-border bg-white p-8 shadow-sm transition-all duration-700 hover:shadow-xl ${pillar.glow} hover:-translate-y-2 ${pillar.border} ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      {/* Top accent line */}
      <div className={`absolute left-0 top-0 h-1 w-full rounded-t-3xl ${pillar.accent} opacity-0 transition-all duration-300 group-hover:opacity-100`} />

      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${pillar.iconBg} transition-transform duration-300 group-hover:scale-110`}>
        <pillar.icon className={`h-7 w-7 ${pillar.iconColor}`} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-deep-blue font-display">
        {pillar.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
    </div>
  )
}

export function VisionSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)

  useEffect(() => {
    const obs1 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.3 }
    )
    const obs2 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBannerVisible(true) },
      { threshold: 0.2 }
    )
    if (headerRef.current) obs1.observe(headerRef.current)
    if (bannerRef.current) obs2.observe(bannerRef.current)
    return () => { obs1.disconnect(); obs2.disconnect() }
  }, [])

  return (
    <section id="vision" className="relative bg-secondary py-24 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--deep-blue) 1px, transparent 1px), linear-gradient(90deg, var(--deep-blue) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-sky">Our Vision</span>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-deep-blue md:text-5xl font-display">
            Education Beyond Textbooks
          </h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Inspired by the Gurukul tradition, we believe education must develop the whole
            person — mind, character, and community. Our three pillars guide everything we do.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>

        {/* Gurukul spirit banner */}
        <div
          ref={bannerRef}
          className={`mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-deep-blue to-sky p-10 text-center transition-all duration-700 md:p-14 ${bannerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Orbs */}
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
          {/* Dot overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold">
              ✦ The Gurukul Spirit ✦
            </div>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-white/80 md:text-lg">
              In the ancient Gurukul system, learning was not confined to classrooms. It was
              community-rooted, value-based, and deeply personal. At P.P.E.S., we bring that
              spirit into a modern context — bridging tradition and progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
