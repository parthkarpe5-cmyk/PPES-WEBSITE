"use client"

import { GraduationCap, Heart, Brain } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const pillars = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description:
      "Experiential and resource-based learning where the syllabus stays the same but students truly understand — not just memorize.",
    accent: "from-[#2FA8CC]/20 to-[#1F4E79]/10",
    iconColor: "text-[#2FA8CC]",
  },
  {
    icon: Heart,
    title: "Inner Growth & Cultural Awareness",
    description:
      "Values rooted in Gurukul traditions — respect, self-discipline, cultural identity, and the strength to stand by one's roots.",
    accent: "from-[#FF6B00]/20 to-[#C9A227]/10",
    iconColor: "text-[#FF6B00]",
  },
  {
    icon: Brain,
    title: "Leadership & Logical Reasoning",
    description:
      "Nurturing confident thinkers and decision-makers who can analyze, reason, and lead with clarity and character.",
    accent: "from-[#C9A227]/20 to-[#FF6B00]/10",
    iconColor: "text-[#C9A227]",
  },
]

function PillarCard({ pillar, index }: { pillar: (typeof pillars)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`group relative flex flex-col rounded-3xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-[#2FA8CC]/10 hover:-translate-y-2 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      {/* Top shimmer accent bar */}
      <div className="absolute left-1/2 top-0 h-[3px] w-12 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-[#C9A227] to-[#f0d074] transition-all duration-300 group-hover:w-24" />

      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.accent} transition-transform duration-300 group-hover:scale-110`}>
        <pillar.icon className={`h-8 w-8 ${pillar.iconColor}`} />
      </div>

      <h3 className="mt-6 text-lg font-bold text-[#1F4E79]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {pillar.title}
      </h3>

      <div className="mx-auto mt-3 h-px w-8 rounded-full bg-[#E2E8F0] transition-all group-hover:w-16 group-hover:bg-[#C9A227]/50" />

      <p className="mt-4 text-sm leading-relaxed text-[#5A6B7B]">{pillar.description}</p>
    </div>
  )
}

export function VisionSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.3 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="vision" className="relative bg-[#F5F8FA] py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#1F4E79 1px, transparent 1px), linear-gradient(90deg, #1F4E79 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-[#2FA8CC]">Our Vision</span>
          <h2
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-[#1F4E79] md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Education Beyond Textbooks
          </h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-[#5A6B7B]">
            Inspired by the Gurukul tradition, we believe education must develop the whole
            person — mind, character, and community. Our three pillars guide everything we do.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>

        {/* Gurukul spirit banner */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F4E79] via-[#1a3f63] to-[#2FA8CC] p-12 text-center md:p-16">
          {/* Orbs */}
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[#C9A227]/10 blur-2xl" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              ✦ The Gurukul Spirit ✦
            </div>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-white/80 md:text-lg">
              In the ancient Gurukul system, learning was not confined to classrooms. It was
              community-rooted, value-based, and deeply personal. At P.P.E.S., we bring that
              spirit into a modern context — bridging tradition and progress for holistic
              development.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
