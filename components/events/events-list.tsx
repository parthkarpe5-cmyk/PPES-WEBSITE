import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

const upcomingEvents = [
  {
    title: "Leadership Summit 2026",
    date: "March 15-16, 2026",
    location: "New Delhi",
    category: "Leadership",
    attendees: "300+",
    description:
      "A two-day intensive summit bringing together student leaders from across India for networking, workshops, and keynote sessions from industry leaders.",
  },
  {
    title: "Design Thinking Bootcamp",
    date: "March 22, 2026",
    location: "Online",
    category: "Workshop",
    attendees: "150",
    description:
      "Learn human-centered design principles and apply them to real-world social challenges. Includes live exercises, group work, and expert feedback.",
  },
  {
    title: "Community Impact Drive",
    date: "April 5-12, 2026",
    location: "Mumbai",
    category: "Social Impact",
    attendees: "200+",
    description:
      "A week-long program empowering students to create tangible social impact in underserved communities through collaborative projects.",
  },
  {
    title: "Entrepreneurship Masterclass",
    date: "April 18, 2026",
    location: "Bangalore",
    category: "Workshop",
    attendees: "100",
    description:
      "Discover the fundamentals of building a startup from scratch. From ideation to pitch, learn what it takes to turn your idea into reality.",
  },
  {
    title: "Youth Policy Forum",
    date: "May 3, 2026",
    location: "Hyderabad",
    category: "Leadership",
    attendees: "250",
    description:
      "A forum for young voices to discuss and propose policy ideas on education, technology, and community development with policymakers.",
  },
  {
    title: "Creative Writing Retreat",
    date: "May 17-18, 2026",
    location: "Jaipur",
    category: "Workshop",
    attendees: "60",
    description:
      "An intimate retreat for aspiring writers to hone their craft through guided sessions, peer feedback, and creative exercises.",
  },
]

export function EventsList() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Upcoming
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Upcoming Events
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.title}
              className="flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {event.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees}
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>
              <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {event.location}
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
              >
                Register Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
