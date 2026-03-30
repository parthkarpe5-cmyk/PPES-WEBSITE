import { Eye, Compass } from "lucide-react"

export function AboutVision() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Eye className="h-6 w-6 text-accent-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To build a future where every student has access to the mentorship,
              resources, and community they need to become confident leaders and
              agents of positive change. We envision a connected ecosystem of
              learners who lift each other up through collaboration and shared
              purpose.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Compass className="h-6 w-6 text-accent-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To empower students through practical workshops, leadership
              programs, and community-driven initiatives that bridge the gap
              between academic knowledge and real-world impact. We create
              platforms for growth, collaboration, and service that equip young
              leaders with the skills to shape their communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
