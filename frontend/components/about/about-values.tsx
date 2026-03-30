import { Crown, TrendingUp, Handshake, Heart } from "lucide-react"

const values = [
  {
    icon: Crown,
    title: "Leadership",
    description:
      "We cultivate leaders who inspire action, make decisions with integrity, and uplift those around them.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description:
      "Continuous improvement is at our core. We believe in pushing boundaries and embracing challenges as opportunities.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description:
      "Great things happen when people come together. We foster partnerships that amplify impact and create shared value.",
  },
  {
    icon: Heart,
    title: "Service",
    description:
      "We are driven by the desire to give back. Every program and event is designed with community impact in mind.",
  },
]

export function AboutValues() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Core Values
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            What We Stand For
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="group rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary">
                <value.icon className="h-7 w-7 text-accent-foreground transition-colors group-hover:text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
