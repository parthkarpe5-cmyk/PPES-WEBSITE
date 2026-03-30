import Image from "next/image"
import { Star } from "lucide-react"

const highlights = [
  {
    image: "/ppes/sabha/IMG-20241014-WA0014.jpg",
    title: "Community Disha Sabha",
    description: "Engaging with students and addressing the community to foster an environment of growth.",
  },
  {
    image: "/ppes/events/ml_ai_workshop/m1.jpg",
    title: "Disha Sabha Initiatives",
    description: "A landmark event that brought together local leaders and students for inspiration.",
  },
  {
    image: "/ppes/posters/IMG-20241202-WA0023.jpg",
    title: "Educational Drives",
    description: "Driving literacy campaigns and educational awareness throughout Savardhat.",
  },
]

export function GalleryHighlights() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Highlight Moments
          </span>
        </div>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Defining Moments
        </h2>

        <div className="mt-12 flex flex-col gap-10">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col gap-8 md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } items-center`}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl md:w-1/2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
