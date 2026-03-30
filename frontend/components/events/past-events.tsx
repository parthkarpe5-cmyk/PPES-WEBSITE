import Image from "next/image"
import { Calendar, Users } from "lucide-react"

const pastEvents = [
  {
    title: "Leadership Workshop 2025",
    date: "November 2025",
    attendees: "180+",
    image: "/ppes/events/ml_ai_workshop/m2.jpg",
  },
  {
    title: "Hackathon for Good",
    date: "September 2025",
    attendees: "120+",
    image: "/ppes/events/ml_ai_workshop/m3.jpg",
  },
  {
    title: "Annual Impact Award Ceremony",
    date: "July 2025",
    attendees: "250+",
    image: "/ppes/sabha/IMG-20241014-WA0016.jpg",
  },
  {
    title: "Design Sprint Workshop",
    date: "May 2025",
    attendees: "90+",
    image: "/ppes/events/my_health_my_growth/mhmg1.jpg",
  },
]

export function PastEvents() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Past Events
        </span>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          What We Have Done
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pastEvents.map((event) => (
            <div
              key={event.title}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {event.attendees}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
