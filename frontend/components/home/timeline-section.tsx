"use client"

import { useEffect, useRef, useState } from "react"
import {
  Search, Rocket, Trophy, Stethoscope, Bus, TreePine, Users, Quote,
} from "lucide-react"

const milestones = [
  {
    icon: Search,
    date: "Jan – Jun 2024",
    title: "Research Phase",
    description: "6 months of educational field research across Savardhat to understand learning gaps and community needs.",
    color: "bg-[#2FA8CC]",
    glow: "shadow-[#2FA8CC]/40",
  },
  {
    icon: Rocket,
    date: "17 June 2024",
    title: "School Launch",
    description: "Four 12th-pass founders launched P.P.E.S. in Savardhat Village with a vision to reform rural education.",
    color: "bg-[#FF6B00]",
    glow: "shadow-[#FF6B00]/40",
  },
  {
    icon: Trophy,
    date: "Jul – Aug 2024",
    title: "Sports & Cultural Events",
    description: "First round of sports tournaments and cultural programs building student confidence and teamwork.",
    color: "bg-[#C9A227]",
    glow: "shadow-[#C9A227]/40",
  },
  {
    icon: Stethoscope,
    date: "Sep 2024",
    title: "Health Awareness Session",
    description: "Dr. Amita Suryawanshi conducted health awareness sessions for students and villagers.",
    color: "bg-[#2FA8CC]",
    glow: "shadow-[#2FA8CC]/40",
  },
  {
    icon: Bus,
    date: "Oct 2024",
    title: "Panjim Field Trip",
    description: "Students explored Miramar, the Science Centre, Yog Path, and Museum — learning beyond village boundaries.",
    color: "bg-[#FF6B00]",
    glow: "shadow-[#FF6B00]/40",
  },
  {
    icon: TreePine,
    date: "Nov 2024",
    title: "Environmental Awareness",
    description: "Village-level environmental awareness session inspiring students to care for their surroundings.",
    color: "bg-[#C9A227]",
    glow: "shadow-[#C9A227]/40",
  },
  {
    icon: Users,
    date: "Ongoing",
    title: "Volunteer Teacher Expansion",
    description: "Growing to 16 voluntary teachers including B.Ed trainees, strengthening the mentor network.",
    color: "bg-[#2FA8CC]",
    glow: "shadow-[#2FA8CC]/40",
  },
]

function TimelineItem({ milestone, index }: { milestone: (typeof milestones)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isLeft = index % 2 === 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`flex items-start gap-6 md:gap-0 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Content card */}
      <div className={`flex-1 md:px-10 ${isLeft ? "md:text-right" : "md:text-left"}`}>
        <div className={`group inline-block rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#2FA8CC]/10 hover:-translate-y-1 text-left`}>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2FA8CC]">
            {milestone.date}
          </span>
          <h3 className="mt-1 text-base font-bold text-[#1F4E79]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {milestone.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#5A6B7B]">
            {milestone.description}
          </p>
        </div>
      </div>

      {/* Icon node */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${milestone.color} shadow-xl ${milestone.glow} ring-4 ring-white z-10`}
        >
          <milestone.icon className="h-5 w-5 text-white" />
        </div>
        {index < milestones.length - 1 && (
          <div className="hidden md:block w-0.5 bg-gradient-to-b from-[#2FA8CC]/40 to-[#E2E8F0] flex-1 mt-2" style={{ height: "80px" }} />
        )}
      </div>

      {/* Spacer */}
      <div className="hidden flex-1 md:block" />
    </div>
  )
}

export function TimelineSection() {
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
    <section id="journey" className="relative bg-white py-28 overflow-hidden">
      {/* Subtle radial glow in center */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#E8F6FA]/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-[#2FA8CC]">Our Journey</span>
          <h2
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-[#1F4E79] md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From Research to Impact
          </h2>
          <div className="gold-divider mx-auto mt-4" />
        </div>

        {/* Timeline */}
        <div className="mt-16 flex flex-col gap-8 md:gap-2">
          {milestones.map((milestone, index) => (
            <TimelineItem key={milestone.title} milestone={milestone} index={index} />
          ))}
        </div>

        {/* Student quote */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/5 to-[#E8F6FA]/30 px-8 py-12 text-center">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#C9A227]/10 blur-2xl" />
          <Quote className="mx-auto h-8 w-8 text-[#C9A227]" />
          <blockquote
            className="mx-auto mt-5 max-w-2xl text-xl font-bold italic leading-relaxed text-[#1F4E79] md:text-2xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            &ldquo;There was so much to learn in our own area, but today it felt different and more beautiful.&rdquo;
          </blockquote>
          <div className="gold-divider mx-auto mt-5" />
          <cite className="mt-4 block text-sm font-semibold not-italic text-[#5A6B7B]">
            — A P.P.E.S. Student, Panjim Field Trip
          </cite>
        </div>
      </div>
    </section>
  )
}
