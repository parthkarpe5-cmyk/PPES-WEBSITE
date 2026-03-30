import Image from "next/image"

const pastWorkshops = [
  {
    title: "Leadership Essentials Bootcamp",
    date: "October 2025",
    participants: "85",
    image: "/images/gallery-5.jpg",
  },
  {
    title: "Creative Problem Solving",
    date: "August 2025",
    participants: "60",
    image: "/images/gallery-4.jpg",
  },
  {
    title: "Public Speaking Intensive",
    date: "June 2025",
    participants: "45",
    image: "/images/gallery-1.jpg",
  },
]

export function PastWorkshops() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Past Workshops
        </span>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Highlights From Previous Sessions
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pastWorkshops.map((ws) => (
            <div key={ws.title} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={ws.image}
                  alt={ws.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{ws.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ws.date} &middot; {ws.participants} participants
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
