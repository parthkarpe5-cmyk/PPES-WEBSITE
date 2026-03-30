import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HostEventCTA() {
  return (
    <section className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-background md:text-4xl">
          Want to Host an Event With Us?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-background/60">
          Partner with Prarambha Path to organize impactful events at your
          institution. We provide the framework, speakers, and community support
          to make it happen.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
        >
          Get in Touch
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
