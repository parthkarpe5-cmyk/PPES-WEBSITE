import { ArrowRight, Heart } from "lucide-react"
import Link from "next/link"

export function VolunteerCTA() {
  return (
    <section className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-background md:text-4xl">
            Want to Make a Bigger Impact?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-background/60">
            Join our volunteer team and be part of organizing events, mentoring
            students, and building something that matters. Your time and skills
            can help shape the next generation of leaders.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
          >
            Become a Volunteer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
