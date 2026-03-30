"use client"

import Link from "next/link"
import { BookOpen, Users, Award, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const highlights = [
  {
    icon: BookOpen,
    title: "B.Ed Trainees",
    description: "Aspiring educators gaining real-world teaching experience while shaping young minds.",
  },
  {
    icon: Users,
    title: "Voluntary Faculty",
    description: "14 dedicated mentors, founding members, and administrators who serve for purpose — not for pay.",
  },
  {
    icon: Award,
    title: "Strong Mentor Bond",
    description: "Personal relationships where teachers know each student's strengths, struggles, and dreams.",
  },
]

function HighlightCard({ item, index }: { item: (typeof highlights)[0]; index: number }) {
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
      className={`group relative rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all duration-700 hover:border-[#C9A227]/40 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C9A227]/10 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      {/* Gold shimmer border on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, transparent 60%, rgba(201,162,39,0.08) 100%)' }}
      />

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]/15 ring-1 ring-[#C9A227]/20 transition-transform duration-300 group-hover:scale-110">
        <item.icon className="h-7 w-7 text-[#C9A227]" />
      </div>
      <h3 className="relative mt-6 text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {item.title}
      </h3>
      <div className="mx-auto mt-3 h-px w-8 bg-[#C9A227]/30 rounded-full transition-all group-hover:w-16 group-hover:bg-[#C9A227]/60" />
      <p className="relative mt-4 text-sm leading-relaxed text-white/60 group-hover:text-white/75 transition-colors">
        {item.description}
      </p>
    </div>
  )
}

export function AcharyaSection() {
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
    <section id="acharya" className="relative overflow-hidden bg-[#0d1f35] py-28">
      {/* Floating orbs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C9A227]/10 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-[#2FA8CC]/8 blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />
      <div className="absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-[#FF6B00]/8 blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-[#C9A227]">Faculty</span>
          <h2
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Acharya Mandal{" "}
            <span className="shimmer-text">— The Mentor Circle</span>
          </h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/60">
            A faculty platform inspired by the Gurukul tradition where mentors don&apos;t just
            teach subjects — they guide students in academics, life values, and personal growth.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {highlights.map((item, i) => (
            <HighlightCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/faculties"
            className="group inline-flex items-center gap-3 rounded-2xl border-2 border-[#C9A227]/50 bg-[#C9A227]/10 px-8 py-4 text-sm font-bold text-[#C9A227] transition-all duration-300 hover:border-[#C9A227] hover:bg-[#C9A227]/20 hover:shadow-xl hover:shadow-[#C9A227]/20 hover:scale-[1.03]"
          >
            Meet the Acharya Mandal
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
