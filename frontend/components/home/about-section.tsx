"use client"

import { Users, BookOpen, GraduationCap, Calendar, Flame, CheckCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const stats = [
  { icon: Calendar, value: "17 June 2024", label: "Founded", color: "text-sky" },
  { icon: Users, value: "4", label: "Young Founders", color: "text-saffron" },
  { icon: GraduationCap, value: "50+", label: "Students Enrolled", color: "text-gold" },
  { icon: BookOpen, value: "16", label: "Voluntary Teachers", color: "text-sky" },
]

const values = [
  "Experiential, resource-based learning",
  "Gurukul-inspired mentor relationships",
  "Holistic development: mind, body & character",
  "Free education for rural children",
]

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" className="relative bg-white py-24 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-light-blue/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/6 blur-3xl pointer-events-none" />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-6"
      >
        {/* Header */}
        <div className={`mb-16 text-center transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <span className="section-label text-sky">Our Story</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-deep-blue md:text-5xl font-display">
            Born from Research,{" "}
            <span className="relative inline-block">
              Built on Purpose
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-gold to-amber-300 opacity-70" />
            </span>
          </h2>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left: Story */}
          <div className={`transition-all duration-700 delay-100 ${visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              In June 2024, four 12th-pass young founders launched Prarambha Path Evening
              School after{" "}
              <strong className="font-semibold text-deep-blue">
                6 months of dedicated educational field research
              </strong>{" "}
              in Savardhat Village. What started as a question —
              &ldquo;How can we make learning truly meaningful?&rdquo; — became a movement.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              With <strong className="font-semibold text-deep-blue">50+ students</strong> and{" "}
              <strong className="font-semibold text-deep-blue">16 voluntary teachers</strong>, we
              practice experiential and resource-based learning. The bond between students and
              teachers isn&apos;t institutional — it&apos;s personal and rooted in mutual respect.
            </p>

            {/* Values list */}
            <ul className="mt-8 space-y-3">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                  {v}
                </li>
              ))}
            </ul>

            {/* Quote */}
            <div className="mt-10 flex items-start gap-4 rounded-2xl border-l-4 border-gold bg-gradient-to-r from-gold/8 to-transparent px-6 py-5">
              <Flame className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p className="text-sm font-semibold italic text-deep-blue leading-relaxed">
                &ldquo;Syllabus remained the same, learning pattern changed.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-200 ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group flex flex-col rounded-2xl border border-border bg-gradient-to-br from-white to-secondary/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky/8 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky/10 to-transparent ring-1 ring-sky/15`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="mt-4 text-2xl font-bold text-deep-blue font-display">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
