interface PageHeaderProps {
  tag: string
  title: string
  description: string
}

export function PageHeader({ tag, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {tag}
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl font-display">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </section>
  )
}
