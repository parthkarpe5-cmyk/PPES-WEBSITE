import { Quote } from "lucide-react"

const reflections = [
  {
    name: "Aishwarya K.",
    event: "Leadership Summit 2025",
    reflection:
      "Seeing so many passionate students in one place made me realize that I am not alone in wanting to make a difference. The energy was electric.",
  },
  {
    name: "Mohit S.",
    event: "Hackathon for Good",
    reflection:
      "Building a project in 24 hours with strangers who became friends was the highlight of my college life. It taught me what collaboration truly means.",
  },
  {
    name: "Divya R.",
    event: "Public Speaking Workshop",
    reflection:
      "I walked in terrified of speaking in public. I walked out with the confidence to present my ideas to anyone. That workshop changed everything.",
  },
]

export function GalleryReflections() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Student Reflections
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            In Their Own Words
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reflections.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-border bg-card p-8"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.reflection}
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="mt-0.5 text-sm text-primary">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
