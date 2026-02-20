const speakers = [
  {
    name: "Dr. Ananya Sharma",
    expertise: "Communication & Leadership",
    bio: "TEDx speaker and communication expert with 15 years of experience training leaders across Fortune 500 companies.",
    initials: "AS",
  },
  {
    name: "Prof. Karan Mehta",
    expertise: "Design Thinking & Innovation",
    bio: "Professor at IIT Delhi and design consultant who has led innovation workshops for startups and social enterprises.",
    initials: "KM",
  },
  {
    name: "Nisha Gupta",
    expertise: "Personal Branding & Marketing",
    bio: "Digital marketing strategist and personal branding coach helping young professionals build their online presence.",
    initials: "NG",
  },
  {
    name: "Aditya Rao",
    expertise: "Product Management & Tech",
    bio: "Former PM at a leading tech company, now mentoring students on building products that solve real-world problems.",
    initials: "AR",
  },
]

export function WorkshopSpeakers() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Expert Speakers
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Learn From the Best
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <div key={speaker.name} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent">
                <span className="text-xl font-bold text-accent-foreground">{speaker.initials}</span>
              </div>
              <h3 className="mt-5 font-semibold text-foreground">{speaker.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{speaker.expertise}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{speaker.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
