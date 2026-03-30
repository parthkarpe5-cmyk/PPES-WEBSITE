const milestones = [
  {
    year: "2021",
    title: "The Beginning",
    description:
      "Prarambha Path was founded by a group of passionate students who believed in the power of community-driven growth.",
  },
  {
    year: "2022",
    title: "First Leadership Summit",
    description:
      "Hosted our inaugural summit with 200+ students from 15 institutions, establishing our flagship program.",
  },
  {
    year: "2023",
    title: "National Expansion",
    description:
      "Expanded to 10 cities across India, partnering with 8 institutions to deliver workshops and events.",
  },
  {
    year: "2024",
    title: "1000 Students Milestone",
    description:
      "Crossed 1,000 active community members and launched our online workshop series reaching students nationwide.",
  },
  {
    year: "2025",
    title: "Social Impact Program",
    description:
      "Launched dedicated community service programs, enabling students to create tangible impact in underserved areas.",
  },
  {
    year: "2026",
    title: "Growing Stronger",
    description:
      "Reaching 2,500+ students with 15 partner institutions, continuing to innovate with new programs and partnerships.",
  },
]

export function AboutTimeline() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Our Journey
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How We Got Here
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" />
          <div className="flex flex-col gap-10">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex flex-col gap-4 md:flex-row md:gap-10 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 md:text-right">
                  {index % 2 === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <span className="text-sm font-bold text-primary">
                        {milestone.year}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </div>
                <div className="relative hidden shrink-0 items-center justify-center md:flex">
                  <div className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  {index % 2 !== 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <span className="text-sm font-bold text-primary">
                        {milestone.year}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                  {/* mobile fallback for odd items */}
                  {index % 2 === 0 ? null : null}
                </div>
                {/* Mobile view: show all items */}
                {index % 2 !== 0 && (
                  <div className="rounded-xl border border-border bg-card p-6 md:hidden">
                    <span className="text-sm font-bold text-primary">
                      {milestone.year}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
