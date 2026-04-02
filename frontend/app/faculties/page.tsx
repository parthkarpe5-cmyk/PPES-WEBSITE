"use client"

import { GraduationCap, Heart, Quote, ArrowRight, Star, Cpu, FlaskConical, BookOpen, Calculator, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const mentors = [
    {
        name: "Sir Vasant Kelkar",
        image: "/ppes/gurujis/vasant.jpeg",
        role: "Guiding Mentor",
        contribution:
            "A pillar of wisdom and experience, guiding the vision of Prarambha Path with deep educational insight.",
    },
    {
        name: "Sir Omkar Kelkar",
        image: "/ppes/gurujis/omkar.jpeg",
        role: "Guiding Mentor",
        contribution:
            "Providing strategic direction and mentorship to ensure the initiative stays true to its Gurukul roots.",
    },
]

// Colour palette cycling for cards
const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-purple-500 to-violet-600",
    "from-cyan-500 to-blue-600",
    "from-pink-500 to-rose-600",
    "from-yellow-500 to-orange-500",
    "from-green-500 to-emerald-600",
    "from-sky-500 to-cyan-600",
    "from-indigo-500 to-purple-600",
    "from-red-500 to-rose-600",
    "from-teal-500 to-green-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-yellow-500",
]

// ─── ALL 14 REAL MEMBERS FROM THE SURVEY ───────────────────────────────────
const faculties = [
    // ── Founding Members ───────────────────────────────────────────────────
    {
        name: "Chandrashekhar Laxuman Parab Gaonkar",
        image: "/ppes/gurujis/chandra.jpeg",
        studies: "Second Year Bachelor of Science",
        role: "Founding Member",
        department: "Founding",
        contribution:
            "Co-founded Prarambha Path Evening School, laying the groundwork for delivering quality education to students of Savardhat village through the Gurukul model.",
        goal: "Not just to learn, but to see & feel science and math in harmony, dancing through nature, all around,beyond the book, everywhere around.",
        icon: Star,
    },
    {
        name: "Anish Bhiva Naik",
        image: "/ppes/gurujis/anish.jpeg",
        studies: "Second Year Bachelor of Arts",
        role: "Founding Member",
        department: "Founding",
        contribution:
            "Instrumental in establishing the school's culture of holistic education, blending academic rigour with arts and social awareness.",
        goal: "To ensure that education transforms lives, not just transcripts.",
        icon: Star,
    },
    {
        name: "Parth Karpe",
        image: "/ppes/gurujis/parth.jpeg",
        studies: "Second Year, Computer Engineering",
        role: "Founding Member",
        department: "Founding",
        contribution:
            "Brings technology and digital initiative to the school, building the digital presence and web infrastructure for PPES.",
        goal: "To bridge the digital divide and make tech-literacy universal.",
        icon: Star,
    },
    {
        name: "Samesh Parsekar",
        image: "/ppes/gurujis/samesh.jpeg",
        studies: "Second Year Bachelor of Science",
        role: "Founding Member",
        department: "Founding",
        contribution:
            "Played a key role in establishing the foundational science curriculum and fostering analytical thinking among students.",
        goal: "To inspire every student to ask 'why' and 'how'.",
        icon: Star,
    },

    // ── Administration ─────────────────────────────────────────────────────
    {
        name: "Prathamesh Bhagu Shinde",
        image: "/ppes/gurujis/prathamesh.jpeg",
        studies: "B.A.B.Ed. Graduate",
        role: "Administrator",
        department: "Administration",
        contribution:
            "Manages the day-to-day operations, scheduling, and administrative affairs of the school, ensuring smooth functioning of all academic activities.",
        goal: "To create a structured, nurturing environment where every student can thrive.",
        icon: GraduationCap,
    },
    {
        name: "Adarsh Sajikumar Pillai",
        image: "/ppes/gurujis/adarsh.jpeg",
        studies: "Second Year Bachelor of Commerce",
        role: " Accounting Manager",
        department: "Administration",
        contribution:
            "Oversees financial planning and resource management, keeping the school's operations sustainable and transparent.",
        goal: "To guide students to learn with confidence, grow with purpose, and discover their true potential.",
        icon: Calculator,
    },

    // ── Science Department ─────────────────────────────────────────────────
    {
        name: "Saisha Naik",
        image: "/ppes/gurujis/saisha.jpeg",
        studies: "Third Year Bachelor of Science, B.Ed",
        role: "Head of Science Department",
        department: "Science Department",
        contribution:
            "Leads the science faculty, designing an inquiry-based curriculum that makes science accessible and exciting for all students.",
        goal: "To build the next generation of curious, evidence-driven thinkers.",
        icon: FlaskConical,
    },
    {
        name: "Anisha Gad",
        image: "/ppes/gurujis/anisha.jpeg",
        studies: "Third Year Bachelor of Science, B.Ed",
        role: "Teacher, Science Department",
        department: "Science Department",
        contribution:
            "Conducts hands-on science sessions, making abstract concepts tangible through experiments and real-world applications.",
        goal: "To ignite a lifelong love for science in every student.",
        icon: FlaskConical,
    },
    {
        name: "Mansi Mandrekar",
        image: "/ppes/gurujis/mansi.jpeg",
        studies: "Second Year Bachelor of Arts",
        role: "Teacher, Science Department",
        department: "Science Department",
        contribution:
            "Bridges the gap between arts and science, helping students appreciate the interconnectedness of all disciplines.",
        goal: "To show students that curiosity knows no boundaries.",
        icon: FlaskConical,
    },
    {
        name: "Moheet Gaonkar",
        image: "/ppes/gurujis/moheet.jpeg",
        studies: "Second Year VLSI Design and Technology",
        role: "Teacher, Science Department & Digital Wing",
        department: "Science & Digital Wing",
        contribution:
            "Integrates computer science and digital tools into the science curriculum, preparing students for a technology-driven world.",
        goal: "To make digital literacy a core skill for every student.",
        icon: Cpu,
    },
    {
        name: "Chinmayee Kelkar",
        image: "/ppes/gurujis/chinmayee.jpeg",
        studies: "Second Year Engineering",
        role: "Teacher, Science Department & Digital Wing",
        department: "Science & Digital Wing",
        contribution:
            "Supports both science teaching and the school's digital initiatives, bringing engineering problem-solving into the classroom.",
        goal: "To empower students to become creators, not just consumers of technology.",
        icon: Cpu,
    },

    // ── Mathematics Department ─────────────────────────────────────────────
    {
        name: "Salil Parab",
        image: "/ppes/gurujis/salil.jpeg",
        studies: "Second Year Bachelor of Commerce",
        role: "Teacher, Mathematics Department",
        department: "Mathematics Department",
        contribution:
            "Makes mathematics engaging and practical by connecting concepts to everyday financial and commercial scenarios.",
        goal: "To help every student see that numbers tell the story of the world.",
        icon: Calculator,
    },

    // ── English & Social Science Department ───────────────────────────────
    {
        name: "Durva Govekar",
        image: "/ppes/gurujis/durva.jpeg",
        studies: "B.A.B.Ed. Graduate",
        role: "Head of English and Social Science Department",
        department: "English & Social Science",
        contribution:
            "Leads language and social science education, cultivating communication skills, critical thinking, and civic awareness among students.",
        goal: "To give every student a confident voice and an empathetic worldview.",
        icon: Globe,
    },
    {
        name: "Roush Fernandez",
        image: "/ppes/gurujis/roush.jpeg",
        studies: "Second Year Bachelor of Commerce",
        role: "Teacher, English and Social Science Department",
        department: "English & Social Science",
        contribution:
            "Teaches English and social sciences with an emphasis on real-world relevance, storytelling, and student expression.",
        goal: "To Help Students to Become a Better Version of Themselves.",
        icon: BookOpen,
    },
]

// ─── Group faculties by department for display ────────────────────────────
const departmentOrder = [
    "Founding",
    "Administration",
    "Science Department",
    "Science & Digital Wing",
    "Mathematics Department",
    "English & Social Science",
]

const departmentLabels: Record<string, string> = {
    "Founding": "🌱 Founding Members",
    "Administration": "🏛️ Administration",
    "Science Department": "🔬 Science Department",
    "Science & Digital Wing": "💻 Science & Digital Wing",
    "Mathematics Department": "📐 Mathematics Department",
    "English & Social Science": "📖 English & Social Science",
}

export default function FacultiesPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-deep-blue to-sky py-20 text-center">
                <div className="mx-auto max-w-7xl px-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gold font-display">
                        Our Team
                    </span>
                    <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl font-display">
                        Acharya Mandal
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                        14 passionate young educators, founding members, and administrators —
                        all voluntarily dedicating their time and skills to empower the
                        students of Savardhat.
                    </p>
                </div>
            </section>

            {/* Mentor Appreciation */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-deep-blue font-display">
                            Guiding Lights
                        </h2>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gold" />
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Special acknowledgment to the mentors whose wisdom shapes our path.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor.name}
                                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gold/30 p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/20"
                            >
                                {/* Animated dynamic golden background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-amber-500/5 to-saffron/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gold/20 blur-3xl transition-transform duration-700 group-hover:translate-x-8 group-hover:translate-y-8" />
                                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-yellow-500/10 blur-3xl transition-transform duration-700 group-hover:-translate-x-8 group-hover:-translate-y-8" />
                                
                                {/* Content Wrapper */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gold/20 border-4 border-white shadow-md text-deep-blue overflow-hidden relative transition-transform duration-500 group-hover:scale-105">
                                        {mentor.image ? (
                                            <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
                                        ) : (
                                            <Heart className="h-12 w-12 text-gold" />
                                        )}
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold text-deep-blue font-display">
                                        {mentor.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-semibold tracking-wider text-saffron uppercase">
                                        {mentor.role}
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                        {mentor.contribution}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty Grid — grouped by department */}
            <section className="bg-secondary py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-deep-blue font-display">
                            Meet the Team
                        </h2>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-sky" />
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Meet the young changemakers dedicating their time and skills to
                            empower the next generation.
                        </p>
                    </div>

                    {departmentOrder.map((dept) => {
                        const members = faculties.filter((f) => f.department === dept)
                        if (members.length === 0) return null
                        return (
                            <div key={dept} className="mt-16">
                                <h3 className="mb-8 text-center text-lg font-bold text-deep-blue font-display">
                                    <span className="inline-block rounded-full border border-sky/30 bg-sky/10 px-5 py-1.5 text-sm">
                                        {departmentLabels[dept]}
                                    </span>
                                </h3>

                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {members.map((faculty, idx) => {
                                        const colorIdx = faculties.indexOf(faculty) % colors.length
                                        const IconComp = faculty.icon
                                        return (
                                            <div
                                                key={faculty.name}
                                                className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky/10"
                                            >
                                                {/* Gradient Header */}
                                                <div
                                                    className={`h-32 w-full bg-gradient-to-r ${colors[colorIdx]} opacity-90`}
                                                />

                                                {/* Avatar */}
                                                <div className="px-6 pb-8">
                                                    <div className="-mt-16 mb-4 flex justify-center">
                                                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm overflow-hidden relative">
                                                            {faculty.image ? (
                                                                <Image src={faculty.image} alt={faculty.name} fill className="object-cover" />
                                                            ) : (
                                                                <IconComp className="h-14 w-14 text-deep-blue" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <h3 className="text-lg font-bold leading-tight text-deep-blue font-display">
                                                            {faculty.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm font-medium text-sky">
                                                            {faculty.role}
                                                        </p>
                                                        <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                                                            {faculty.studies}
                                                        </span>
                                                    </div>

                                                    <div className="mt-6 space-y-4">
                                                        <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
                                                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-deep-blue">
                                                                Contribution
                                                            </span>
                                                            {faculty.contribution}
                                                        </div>

                                                        <div className="flex items-start gap-3 rounded-lg border border-saffron/20 bg-saffron/5 p-4">
                                                            <Quote className="mt-1 h-4 w-4 shrink-0 text-saffron" />
                                                            <div>
                                                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-saffron">
                                                                    Future Goal
                                                                </span>
                                                                <p className="text-sm italic text-deep-blue">
                                                                    &quot;{faculty.goal}&quot;
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {/* Closing */}
                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-bold italic text-deep-blue font-display">
                            &quot;Acharya Mandal – Where Mentorship Meets Mission.&quot;
                        </h3>
                        <div className="mt-8">
                            <Link
                                href="/join"
                                className="inline-flex items-center gap-2 rounded-lg bg-saffron px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-saffron/25 transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-saffron/30"
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
