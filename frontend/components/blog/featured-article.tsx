import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, User } from "lucide-react"

export function FeaturedArticle() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/gallery-5.jpg"
              alt="Featured article about student leadership"
              fill
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Featured
            </span>
          </div>
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Leadership
            </span>
            <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Why Student Leadership Matters More Than Ever in 2026
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              In a world that is changing faster than ever, the ability to lead
              with empathy, adaptability, and vision is no longer optional for
              students. This article explores why investing in leadership
              development during college years creates a ripple effect that
              extends far beyond graduation.
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                Vikram Desai
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                8 min read
              </div>
            </div>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#E55F00]"
            >
              Read Article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
