"use client"

import { GraduationCap, Heart, Quote, ArrowRight } from "lucide-react"
import Link from "next/link"

const mentors = [
    {
        name: "Sir Vasant Kelkar",
        role: "Guiding Mentor",
        contribution:
            "A pillar of wisdom and experience, guiding the vision of Prarambha Path with deep educational insight.",
    },
    {
        name: "Sir Omkar Kelkar",
        role: "Guiding Mentor",
        contribution:
            "Providing strategic direction and mentorship to ensure the initiative stays true to its Gurukul roots.",
    },
]

const faculties = [
    {
        name: "Rohan Naik",
        studies: "B.Ed Trainee",
        role: "Mathematics Instructor",
        contribution:
            "Simplifying complex concepts through practical examples and patient guidance.",
        goal: "To make every student fall in love with numbers.",
        color: "from-blue-500 to-indigo-600",
    },
    {
        name: "Aditi Gawas",
        studies: "B.Com Pursuing",
        role: "Finance & Accounts",
        contribution:
            "Managing the initiative's resources while teaching financial literacy to students.",
        goal: "To ensure transparency and sustainable growth for the school.",
        color: "from-emerald-500 to-teal-600",
    },
    {
        name: "Sanket Parab",
        studies: "B.Sc Physics",
        role: "Science Mentor",
        contribution:
            "Leading hands-on experiments and fostering scientific curiosity.",
        goal: "To create the next generation of innovators.",
        color: "from-orange-500 to-red-600",
    },
    {
        name: "Priya Chari",
        studies: "M.A. English",
        role: "Language Facilitator",
        contribution:
            "Enhancing communication skills through storytelling and drama.",
        goal: "To give every student a confident voice.",
        color: "from-purple-500 to-violet-600",
    },
    {
        name: "Rahul Mestry",
        studies: "Computer Engineering",
        role: "Tech Lead",
        contribution:
            "Introducing students to coding, digital literacy, and modern tools.",
        goal: "To bridge the digital divide in rural education.",
        color: "from-cyan-500 to-blue-600",
    },
    {
        name: "Sneha Sawant",
        studies: "B.A. History",
        role: "Cultural Coordinator",
        contribution:
            "Connecting education with local heritage and traditions.",
        goal: "To keep our roots alive in modern times.",
        color: "from-pink-500 to-rose-600",
    },
]

export default function FacultiesPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-[#1F4E79] to-[#2FA8CC] py-20 text-center">
                <div className="mx-auto max-w-7xl px-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
                        Our Team
                    </span>
                    <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
                        About Our Faculties
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                        Prarambha Path is driven by a dedicated team of voluntary mentors —
                        from B.Ed trainees shaping their teaching skills to commerce
                        students managing finance. United by a passion to give back.
                    </p>
                </div>
            </section>

            {/* Mentor Appreciation */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#1F4E79]">
                            Guiding Lights
                        </h2>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#C9A227]" />
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Special acknowledgment to the mentors whose wisdom shapes our path.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor.name}
                                className="flex flex-col items-center rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-8 text-center transition-all hover:bg-[#C9A227]/10"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/20 text-[#1F4E79]">
                                    <Heart className="h-8 w-8 text-[#C9A227]" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-[#1F4E79]">
                                    {mentor.name}
                                </h3>
                                <p className="text-sm font-medium text-[#FF6B00]">
                                    {mentor.role}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                    {mentor.contribution}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty Grid */}
            <section className="bg-[#F5F8FA] py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#1F4E79]">
                            Acharya Mandal
                        </h2>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#2FA8CC]" />
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Meet the young changemakers dedicating their time and skills to
                            empower the next generation.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {faculties.map((faculty) => (
                            <div
                                key={faculty.name}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2FA8CC]/10"
                            >
                                {/* Gradient Header (Placeholder for photo) */}
                                <div
                                    className={`h-32 w-full bg-gradient-to-r ${faculty.color} opacity-90`}
                                />

                                {/* Profile content */}
                                <div className="px-6 pb-8">
                                    <div className="-mt-12 mb-4 flex justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm text-4xl">
                                            🧑‍🏫
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-[#1F4E79]">
                                            {faculty.name}
                                        </h3>
                                        <p className="text-sm font-medium text-[#2FA8CC]">
                                            {faculty.role}
                                        </p>
                                        <span className="mt-2 inline-block rounded-full bg-[#F5F8FA] px-3 py-1 text-xs font-semibold text-muted-foreground">
                                            {faculty.studies}
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="rounded-lg bg-[#F5F8FA] p-4 text-sm text-muted-foreground">
                                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#1F4E79]">
                                                Contribution
                                            </span>
                                            {faculty.contribution}
                                        </div>

                                        <div className="flex items-start gap-3 rounded-lg border border-[#FF6B00]/20 bg-[#FF6B00]/5 p-4">
                                            <Quote className="mt-1 h-4 w-4 shrink-0 text-[#FF6B00]" />
                                            <div>
                                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                                                    Future Goal
                                                </span>
                                                <p className="text-sm text-[#1F4E79] italic">
                                                    &quot;{faculty.goal}&quot;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Closing */}
                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-bold italic text-[#1F4E79]">
                            &quot;Acharya Mandal – Where Mentorship Meets Mission.&quot;
                        </h3>
                        <div className="mt-8">
                            <Link
                                href="/#connect"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition-all hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30"
                            >
                                Join Our Team
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
