import Link from "next/link"
import { ArrowRight } from "lucide-react"

const stats = [
  { value: "30+", label: "Workshops Hosted" },
  { value: "1,200+", label: "Students Trained" },
  { value: "50+", label: "Expert Speakers" },
  { value: "95%", label: "Satisfaction Rate" },
]

export function WorkshopStats() {
  return (
    <section className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-background/60">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
          >
            Register for a Workshop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
