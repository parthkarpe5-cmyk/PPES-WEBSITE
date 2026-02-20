const team = [
  {
    name: "Vikram Desai",
    role: "Founder & Director",
    bio: "A passionate educator and community builder with 8 years of experience in youth development programs.",
    initials: "VD",
  },
  {
    name: "Priya Nair",
    role: "Head of Programs",
    bio: "Leads workshop design and event strategy, with a background in instructional design and student engagement.",
    initials: "PN",
  },
  {
    name: "Rahul Sharma",
    role: "Community Lead",
    bio: "Manages partnerships and volunteer networks, connecting students across 15+ institutions nationwide.",
    initials: "RS",
  },
  {
    name: "Meera Joshi",
    role: "Creative Director",
    bio: "Shapes the visual identity and storytelling of Prarambha Path, bringing every initiative to life through design.",
    initials: "MJ",
  },
]

export function AboutTeam() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Our Team
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            The People Behind the Path
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent">
                <span className="text-xl font-bold text-accent-foreground">
                  {member.initials}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-foreground">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
