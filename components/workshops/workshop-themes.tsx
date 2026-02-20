import { Crown, MessageSquare, Palette, Code, Brain, Users } from "lucide-react"

const themes = [
  { icon: Crown, title: "Leadership", description: "Develop strategic thinking and decision-making skills." },
  { icon: MessageSquare, title: "Communication", description: "Master public speaking, storytelling, and persuasion." },
  { icon: Palette, title: "Design Thinking", description: "Solve problems with human-centered design approaches." },
  { icon: Code, title: "Tech & Innovation", description: "Explore cutting-edge tools and build digital solutions." },
  { icon: Brain, title: "Personal Growth", description: "Build confidence, resilience, and emotional intelligence." },
  { icon: Users, title: "Teamwork", description: "Learn to collaborate effectively and lead diverse teams." },
]

export function WorkshopThemes() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Workshop Themes
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Skills That Matter
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.title}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary">
                <theme.icon className="h-6 w-6 text-accent-foreground transition-colors group-hover:text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{theme.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
