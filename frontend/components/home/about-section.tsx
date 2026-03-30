"use client"

import { Users, BookOpen, GraduationCap, Calendar, Flame } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const stats = [
  { icon: Calendar, value: "17 June 2024", label: "Founded" },
  { icon: Users, value: "4", label: "Young Founders" },
  { icon: GraduationCap, value: "50+", label: "Students" },
  { icon: BookOpen, value: "16", label: "Voluntary Teachers" },
]

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
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
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`group flex flex-col items-center rounded-2xl border border-white/60 bg-gradient-to-b from-white to-[#E8F6FA]/60 p-8 text-center shadow-sm transition-all duration-700 hover:shadow-xl hover:shadow-[#2FA8CC]/15 hover:-translate-y-1 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2FA8CC]/20 to-[#1F4E79]/10 transition-all group-hover:scale-110 group-hover:bg-[#2FA8CC]/25 ring-1 ring-[#2FA8CC]/20">
        <stat.icon className="h-6 w-6 text-[#2FA8CC]" />
      </div>
      <span className="mt-5 text-2xl font-bold text-[#1F4E79]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {stat.value}
      </span>
      <span className="mt-1 text-sm font-medium text-[#5A6B7B]">{stat.label}</span>
    </div>
  )
}

export function AboutSection() {
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
    <section id="about" className="relative bg-white py-28 overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#E8F6FA]/80 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left – Story */}
          <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
          >
            <span className="section-label text-[#2FA8CC]">Our Story</span>
            <h2
              className="mt-3 text-balance text-4xl font-bold tracking-tight text-[#1F4E79] md:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Born from Research,{" "}
              <span className="relative">
                Built on Purpose
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#f0d074] opacity-70" />
              </span>
            </h2>

            <p className="mt-8 text-pretty text-[15px] leading-relaxed text-[#5A6B7B]">
              In June 2024, four 12th-pass young founders launched Prarambha Path Evening
              School after{" "}
              <strong className="font-semibold text-[#1F4E79]">
                6 months of dedicated educational field research
              </strong>{" "}
              in Savardhat Village. What started as a question —
              &ldquo;How can we make learning truly meaningful?&rdquo; — became a movement.
            </p>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-[#5A6B7B]">
              With <strong className="font-semibold text-[#1F4E79]">50+ students</strong> and{" "}
              <strong className="font-semibold text-[#1F4E79]">16 voluntary teachers</strong>, we
              practice experiential and resource-based learning that builds real understanding.
              The bond between students and teachers isn&apos;t institutional — it&apos;s personal,
              rooted in mutual respect.
            </p>

            {/* Quote callout */}
            <div className="mt-10 flex items-start gap-4 rounded-2xl border-l-4 border-[#C9A227] bg-gradient-to-r from-[#C9A227]/8 to-transparent px-6 py-5">
              <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A227]" />
              <p className="text-sm font-semibold italic text-[#1F4E79] leading-relaxed">
                &ldquo;Syllabus remained the same, learning pattern changed.&rdquo;
              </p>
            </div>
          </div>

          {/* Right – Stats grid */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
