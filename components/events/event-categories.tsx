import { Mic, BookOpen, Heart } from "lucide-react"

const categories = [
  {
    icon: BookOpen,
    title: "Workshops",
    description: "Hands-on skill-building sessions led by industry experts and mentors.",
    count: "12 events",
  },
  {
    icon: Mic,
    title: "Leadership Talks",
    description: "Inspiring talks and panel discussions from leaders and changemakers.",
    count: "8 events",
  },
  {
    icon: Heart,
    title: "Social Impact Programs",
    description: "Community service initiatives creating tangible positive change.",
    count: "10 events",
  },
]

export function EventCategories() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                <cat.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{cat.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <span className="mt-2 inline-block text-xs font-semibold text-primary">
                  {cat.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
