import Link from "next/link"
import { BookOpen, Users, Award, ArrowRight } from "lucide-react"

const highlights = [
    {
        icon: BookOpen,
        title: "B.Ed Trainees",
        description:
            "Aspiring educators gaining real-world teaching experience while shaping young minds.",
    },
    {
        icon: Users,
        title: "Voluntary Faculty",
        description:
            "16 dedicated mentors who teach not for pay, but for purpose and the joy of giving back.",
    },
    {
        icon: Award,
        title: "Strong Mentor Bond",
        description:
            "Personal relationships where teachers know each student's strengths, struggles, and dreams.",
    },
]

export function AcharyaSection() {
    return (
        <section id="acharya" className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] to-[#1F4E79]/90 py-24">
            {/* Gold decorative accent */}
            <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-[#C9A227]/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-[#2FA8CC]/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
                        Faculty
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
                        Acharya Mandal{" "}
                        <span className="text-[#C9A227]">— The Mentor Circle</span>
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C9A227]" />
                    <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-white/65">
                        A faculty platform inspired by the Gurukul tradition where mentors
                        don&apos;t just teach subjects — they guide students in academics, life
                        values, and personal growth.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {highlights.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-[#C9A227]/30 hover:bg-white/10"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9A227]/15">
                                <item.icon className="h-7 w-7 text-[#C9A227]" />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-white">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/60">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="#connect"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#C9A227]/40 bg-[#C9A227]/10 px-7 py-3.5 text-sm font-semibold text-[#C9A227] transition-all hover:border-[#C9A227] hover:bg-[#C9A227]/20"
                    >
                        Explore Acharya Mandal
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
