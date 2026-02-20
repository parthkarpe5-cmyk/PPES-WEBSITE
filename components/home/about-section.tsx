import { Users, BookOpen, GraduationCap, Calendar, Flame } from "lucide-react"

const stats = [
    { icon: Calendar, value: "17 June 2024", label: "Founded" },
    { icon: Users, value: "4", label: "Young Founders" },
    { icon: GraduationCap, value: "50+", label: "Students" },
    { icon: BookOpen, value: "16", label: "Voluntary Teachers" },
]

export function AboutSection() {
    return (
        <section id="about" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left – Story */}
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                            Our Story
                        </span>
                        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                            Born from Research, Built on Purpose
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded-full bg-[#C9A227]" />

                        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                            In June 2024, four 12th-pass young founders launched Prarambha Path
                            Evening School after <strong className="text-foreground">6 months of dedicated educational
                                field research</strong> in Savardhat Village. What started as a question —
                            &ldquo;How can we make learning truly meaningful?&rdquo; — became a
                            movement.
                        </p>
                        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                            With <strong className="text-foreground">50+ students</strong> and{" "}
                            <strong className="text-foreground">16 voluntary teachers</strong>, we
                            practice experiential and resource-based learning that builds real
                            understanding. The bond between students and teachers isn&apos;t
                            institutional — it&apos;s personal, rooted in mutual respect.
                        </p>

                        <div className="mt-8 flex items-start gap-3 rounded-xl border-l-4 border-[#C9A227] bg-[#C9A227]/5 px-5 py-4">
                            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A227]" />
                            <p className="text-sm font-medium italic text-[#1F4E79]">
                                &ldquo;Syllabus remained the same, learning pattern changed.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Right – Stats grid */}
                    <div className="grid grid-cols-2 gap-5">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="group flex flex-col items-center rounded-2xl border border-border bg-gradient-to-b from-white to-[#E8F6FA]/50 p-8 text-center transition-all hover:shadow-lg hover:shadow-[#2FA8CC]/10"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2FA8CC]/10 transition-colors group-hover:bg-[#2FA8CC]/20">
                                    <stat.icon className="h-6 w-6 text-[#2FA8CC]" />
                                </div>
                                <span className="mt-4 text-2xl font-bold text-[#1F4E79]">
                                    {stat.value}
                                </span>
                                <span className="mt-1 text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
