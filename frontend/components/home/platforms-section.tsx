import { Instagram, Youtube, Headphones, Linkedin, Globe } from "lucide-react"

const platforms = [
    {
        icon: Instagram,
        name: "Instagram",
        handle: "@prarambhapath",
        description: "Daily updates, student stories, and behind-the-scenes moments.",
        color: "from-pink-500 to-purple-600",
        url: "#",
    },
    {
        icon: Youtube,
        name: "YouTube",
        handle: "Prarambha Path",
        description: "Event recordings, workshops, and educational content.",
        color: "from-red-500 to-red-700",
        url: "#",
    },
    {
        icon: Headphones,
        name: "Spotify",
        handle: "Student Podcast",
        description: "Conversations with students about learning, dreams, and growth.",
        color: "from-green-500 to-green-700",
        url: "#",
    },
    {
        icon: Linkedin,
        name: "LinkedIn",
        handle: "Prarambha Path",
        description: "Professional updates, partnerships, and milestones.",
        color: "from-blue-600 to-blue-800",
        url: "#",
    },
    {
        icon: Globe,
        name: "Curious Mind",
        handle: "Website",
        description: "Our dedicated platform for curious learners and explorers.",
        color: "from-[#2FA8CC] to-[#1F4E79]",
        url: "#",
    },
]

export function PlatformsSection() {
    return (
        <section className="bg-[#F5F8FA] py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">
                        Our Presence
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                        Our Voice Beyond Classrooms
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#FF6B00]" />
                    <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                        We believe education extends beyond four walls. Follow our journey
                        on the platforms where we share, inspire, and connect with the wider
                        community.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-5 rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-lg hover:shadow-[#FF6B00]/5"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${platform.color} shadow-md`}
                            >
                                <platform.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1F4E79] group-hover:text-[#FF6B00] transition-colors">
                                    {platform.name}
                                </h3>
                                <p className="text-xs font-medium text-[#2FA8CC]">
                                    {platform.handle}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {platform.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
