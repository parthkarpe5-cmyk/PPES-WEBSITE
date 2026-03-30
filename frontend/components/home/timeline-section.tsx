"use client"

import { useEffect, useRef, useState } from "react"
import {
    Search,
    Rocket,
    Trophy,
    Stethoscope,
    Bus,
    TreePine,
    Users,
    Quote,
} from "lucide-react"

const milestones = [
    {
        icon: Search,
        date: "Jan – Jun 2024",
        title: "Research Phase",
        description:
            "6 months of educational field research across Savardhat to understand learning gaps and community needs.",
        color: "bg-[#2FA8CC]",
    },
    {
        icon: Rocket,
        date: "17 June 2024",
        title: "School Launch",
        description:
            "Four 12th-pass founders launched P.P.E.S. in Savardhat Village with a vision to reform rural education.",
        color: "bg-[#FF6B00]",
    },
    {
        icon: Trophy,
        date: "Jul – Aug 2024",
        title: "Sports & Cultural Events",
        description:
            "First round of sports tournaments and cultural programs building student confidence and teamwork.",
        color: "bg-[#C9A227]",
    },
    {
        icon: Stethoscope,
        date: "Sep 2024",
        title: "Health Awareness Session",
        description:
            "Dr. Amita Suryawanshi conducted health awareness sessions for students and villagers.",
        color: "bg-[#2FA8CC]",
    },
    {
        icon: Bus,
        date: "Oct 2024",
        title: "Panjim Field Trip",
        description:
            "Students explored Miramar, the Science Centre, Yog Path, and Museum — learning beyond village boundaries.",
        color: "bg-[#FF6B00]",
    },
    {
        icon: TreePine,
        date: "Nov 2024",
        title: "Environmental Awareness",
        description:
            "Village-level environmental awareness session inspiring students to care for their surroundings.",
        color: "bg-[#C9A227]",
    },
    {
        icon: Users,
        date: "Ongoing",
        title: "Volunteer Teacher Expansion",
        description:
            "Growing to 16 voluntary teachers including B.Ed trainees, strengthening the mentor network.",
        color: "bg-[#2FA8CC]",
    },
]

function TimelineItem({
    milestone,
    index,
}: {
    milestone: (typeof milestones)[0]
    index: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const isLeft = index % 2 === 0

    return (
        <div
            ref={ref}
            className={`flex items-start gap-6 transition-all duration-700 md:gap-10 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Content */}
            <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2FA8CC]">
                    {milestone.date}
                </span>
                <h3 className="mt-1 text-lg font-bold text-[#1F4E79]">
                    {milestone.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {milestone.description}
                </p>
            </div>

            {/* Icon dot */}
            <div className="relative flex shrink-0 flex-col items-center">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${milestone.color} shadow-lg`}
                >
                    <milestone.icon className="h-5 w-5 text-white" />
                </div>
                {index < milestones.length - 1 && (
                    <div className="mt-2 hidden h-24 w-0.5 bg-border md:block" />
                )}
            </div>

            {/* Spacer for alignment */}
            <div className="hidden flex-1 md:block" />
        </div>
    )
}

export function TimelineSection() {
    return (
        <section id="journey" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                        Our Journey
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                        From Research to Impact
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C9A227]" />
                </div>

                {/* Timeline */}
                <div className="mt-16 flex flex-col gap-8 md:gap-0">
                    {milestones.map((milestone, index) => (
                        <TimelineItem
                            key={milestone.title}
                            milestone={milestone}
                            index={index}
                        />
                    ))}
                </div>

                {/* Student quote */}
                <div className="mt-16 flex flex-col items-center rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/5 px-8 py-10 text-center">
                    <Quote className="h-8 w-8 text-[#C9A227]" />
                    <blockquote className="mt-4 max-w-2xl text-lg font-medium italic leading-relaxed text-[#1F4E79]">
                        &ldquo;There was so much to learn in our own area, but today it felt
                        different and more beautiful.&rdquo;
                    </blockquote>
                    <cite className="mt-4 text-sm font-semibold not-italic text-muted-foreground">
                        — A P.P.E.S. Student, Panjim Field Trip
                    </cite>
                </div>
            </div>
        </section>
    )
}
