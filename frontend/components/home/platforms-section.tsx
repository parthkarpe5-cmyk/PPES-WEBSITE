"use client"

import React from "react"
import { Instagram, Youtube, Headphones, Linkedin, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const platforms = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@prarambhapath",
    description: "Daily updates, student stories, and behind-the-scenes moments.",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    url: "https://www.instagram.com/prarambha_path",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    icon: Youtube,
    name: "YouTube",
    handle: "Prarambha Path",
    description: "Event recordings, workshops, and educational content.",
    gradient: "from-red-500 to-red-700",
    url: "https://youtube.com/@prarambhapath?si=wQcjubXc9SCucgBF",
    glow: "group-hover:shadow-red-500/20",
  },
  {
    icon: Headphones,
    name: "Spotify",
    handle: "Student Podcast",
    description: "Conversations with students about learning, dreams, and growth.",
    gradient: "from-green-500 to-green-700",
    url: "https://open.spotify.com/show/20Ah469M6xBubEMBiBZt3Y?si=lYsRyCnkQF6D5QFA04briA",
    glow: "group-hover:shadow-green-500/20",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    handle: "Prarambha Path",
    description: "Professional updates, partnerships, and milestones.",
    gradient: "from-blue-600 to-blue-800",
    url: "#",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Globe,
    name: "Curious Mind",
    handle: "Website",
    description: "Our dedicated platform for curious learners and explorers.",
    gradient: "from-sky to-deep-blue",
    url: "#",
    glow: "group-hover:shadow-sky/20",
  },
]

function PlatformCard({ platform, index }: { platform: (typeof platforms)[0]; index: number }) {
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
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group flex items-start gap-5 rounded-2xl border border-border bg-white p-6 transition-all duration-700 hover:shadow-xl ${platform.glow} hover:-translate-y-1 hover:border-transparent ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${platform.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
      >
        <platform.icon className="h-6 w-6 text-white" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-deep-blue transition-colors group-hover:text-saffron font-display">
          {platform.name}
        </h3>
        <p className="text-xs font-semibold text-sky">{platform.handle}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{platform.description}</p>
      </div>
    </a>
  )
}

export function PlatformsSection() {
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
    <section className="relative bg-secondary py-24 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--deep-blue) 1px, transparent 1px), linear-gradient(90deg, var(--deep-blue) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div
          ref={headerRef}
          className={`text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="section-label text-saffron">Our Presence</span>
          <h2
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-deep-blue md:text-5xl font-display"
          >
            Our Voice Beyond Classrooms
          </h2>
          <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-saffron to-gold" />
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            We believe education extends beyond four walls. Follow our journey on the platforms
            where we share, inspire, and connect with the wider community.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
