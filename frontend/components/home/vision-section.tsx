import { GraduationCap, Heart, Brain } from "lucide-react"

const pillars = [
    {
        icon: GraduationCap,
        title: "Academic Excellence",
        description:
            "Experiential and resource-based learning where the syllabus stays the same but students truly understand — not just memorize.",
    },
    {
        icon: Heart,
        title: "Inner Growth & Cultural Awareness",
        description:
            "Values rooted in Gurukul traditions — respect, self-discipline, cultural identity, and the strength to stand by one's roots.",
    },
    {
        icon: Brain,
        title: "Leadership & Logical Reasoning",
        description:
            "Nurturing confident thinkers and decision-makers who can analyze, reason, and lead with clarity and character.",
    },
]

export function VisionSection() {
    return (
        <section id="vision" className="bg-[#F5F8FA] py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                        Our Vision
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                        Education Beyond Textbooks
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C9A227]" />
                    <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                        Inspired by the Gurukul tradition, we believe education must develop
                        the whole person — mind, character, and community. Our three pillars
                        guide everything we do.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {pillars.map((pillar) => (
                        <div
                            key={pillar.title}
                            className="group relative rounded-2xl border border-border bg-white p-8 text-center transition-all hover:shadow-xl hover:shadow-[#2FA8CC]/8"
                        >
                            {/* Gold top accent */}
                            <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-b-full bg-[#C9A227] transition-all group-hover:w-20" />

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2FA8CC]/10 to-[#2FA8CC]/5">
                                <pillar.icon className="h-8 w-8 text-[#2FA8CC]" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-[#1F4E79]">
                                {pillar.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Gurukul values block */}
                <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#1F4E79] to-[#2FA8CC] p-10 text-center md:p-14">
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                        The Gurukul Spirit
                    </h3>
                    <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-white/75">
                        In the ancient Gurukul system, learning was not confined to
                        classrooms. It was community-rooted, value-based, and deeply
                        personal. At P.P.E.S., we bring that spirit into a modern context —
                        bridging tradition and progress for holistic development.
                    </p>
                </div>
            </div>
        </section>
    )
}
