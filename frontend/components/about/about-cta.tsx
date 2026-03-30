import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AboutCTA() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Want to Be Part of the Journey?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          We are always looking for passionate volunteers, mentors, and
          collaborators who share our vision for student empowerment.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
        >
          Become a Volunteer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
