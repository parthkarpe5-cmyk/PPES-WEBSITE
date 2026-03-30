import Link from "next/link"
import { Calendar, Clock, Users } from "lucide-react"

const workshops = [
  {
    title: "The Art of Public Speaking & Influence",
    speaker: "Dr. Ananya Sharma",
    date: "March 22, 2026",
    duration: "4 hours",
    capacity: "50 seats",
    theme: "Communication",
    description:
      "Master persuasion, storytelling, and confident public speaking through live exercises and expert feedback.",
    featured: true,
  },
  {
    title: "Design Thinking for Social Good",
    speaker: "Prof. Karan Mehta",
    date: "April 10, 2026",
    duration: "6 hours",
    capacity: "40 seats",
    theme: "Design Thinking",
    description:
      "Apply human-centered design to solve real community challenges. Includes group projects and mentorship.",
    featured: false,
  },
  {
    title: "Building Your Personal Brand",
    speaker: "Nisha Gupta",
    date: "April 25, 2026",
    duration: "3 hours",
    capacity: "60 seats",
    theme: "Personal Growth",
    description:
      "Learn to craft your narrative, build an online presence, and stand out in academic and professional settings.",
    featured: false,
  },
  {
    title: "Intro to Product Management",
    speaker: "Aditya Rao",
    date: "May 8, 2026",
    duration: "5 hours",
    capacity: "45 seats",
    theme: "Tech & Innovation",
    description:
      "Understand the product lifecycle from ideation to launch. Includes case studies and hands-on exercises.",
    featured: false,
  },
]

export function FeaturedWorkshops() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Upcoming Workshops
        </span>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Register Now
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {workshops.map((ws) => (
            <div
              key={ws.title}
              className={`flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg ${
                ws.featured ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              {ws.featured && (
                <span className="mb-3 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Featured
                </span>
              )}
              <span className="inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {ws.theme}
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{ws.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                by {ws.speaker}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {ws.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {ws.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {ws.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  {ws.capacity}
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
              >
                Register
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
