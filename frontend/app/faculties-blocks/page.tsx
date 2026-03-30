"use client"

import {
    Music,
    PenTool,
    Mic,
    Video,
    Feather,
    Palette,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"

const creativeTalents = [
    {
        name: "Priya Chari",
        talent: "Poetry & Writing",
        description:
            "Weaving emotions into words. Priya uses her poetic sense to make English literature come alive for students.",
        icon: Feather,
        preview: "/images/poetry-preview.jpg", // Placeholder
        category: "Poetry",
        color: "from-pink-500 to-rose-500",
    },
    {
        name: "Rohan Naik",
        talent: "Singing",
        description:
            "A soulful voice that brings calmness. Rohan believes music is a powerful tool to build focus and patience.",
        icon: Mic,
        preview: "/images/singing-preview.jpg", // Placeholder
        category: "Music",
        color: "from-blue-500 to-indigo-500",
    },
    {
        name: "Sneha Sawant",
        talent: "Traditional Dance",
        description:
            "Expressing culture through movement. Sneha teaches students that discipline in dance translates to discipline in life.",
        icon: Video,
        preview: "/images/dance-preview.jpg", // Placeholder
        category: "Dance",
        color: "from-orange-500 to-red-500",
    },
    {
        name: "Sanket Parab",
        talent: "Sketching & Art",
        description:
            "Seeing the world through lines and shades. Sanket encourages students to visualize scientific concepts through drawing.",
        icon: Palette,
        preview: "/images/art-preview.jpg", // Placeholder
        category: "Art",
        color: "from-purple-500 to-violet-500",
    },
    {
        name: "Aditi Gawas",
        talent: "Blogging",
        description:
            "Documenting journeys and thoughts. Aditi inspires students to articulate their ideas and share them with the world.",
        icon: PenTool,
        preview: "/images/blog-preview.jpg", // Placeholder
        category: "Writing",
        color: "from-teal-500 to-emerald-500",
    },
]

export default function FacultiesBlocksPage() {
    return (
        <>
            {/* Header */}
            <section className="relative overflow-hidden bg-[#1F4E79] py-24 text-center">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#FF6B00] blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#C9A227] blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">
                        Creative Side
                    </span>
                    <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
                        Beyond the Classroom
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                        Our faculties are not just teachers; they are artists, writers, and
                        performers. We believe that a creative teacher inspires a creative
                        student.
                    </p>
                </div>
            </section>

            {/* Inspirational Section */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                        <Music className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-[#1F4E79]">
                        Leading by Creativity
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        When a mentor expresses themselves through art, they give students
                        the permission to do the same. This creative energy flows into our
                        lessons, making learning vibrant and personal.
                    </p>
                </div>
            </section>

            {/* Talent Blocks Grid */}
            <section className="bg-[#F5F8FA] py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {creativeTalents.map((talent) => (
                            <div
                                key={talent.name}
                                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Visual Header */}
                                <div
                                    className={`flex h-48 items-center justify-center bg-gradient-to-br ${talent.color}`}
                                >
                                    <talent.icon className="h-16 w-16 text-white/90 transition-transform duration-500 group-hover:scale-110" />
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full bg-[#F5F8FA] px-3 py-1 text-xs font-semibold text-[#1F4E79]">
                                            {talent.category}
                                        </span>
                                        <span className="text-sm font-bold text-[#FF6B00]">
                                            {talent.name}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-xl font-bold text-[#1F4E79]">
                                        {talent.talent}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {talent.description}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#2FA8CC] opacity-0 transition-opacity group-hover:opacity-100">
                                        <span>View More</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-lg font-medium text-[#1F4E79]">
                            Do you have a creative spark to share?
                        </p>
                        <Link
                            href="/#connect"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg border-2 border-[#1F4E79] px-7 py-3 text-sm font-semibold text-[#1F4E79] transition-all hover:bg-[#1F4E79] hover:text-white"
                        >
                            Join as a Mentor
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
