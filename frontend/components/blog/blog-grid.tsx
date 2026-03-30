import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"

const articles = [
  {
    title: "5 Lessons I Learned From Organizing My First Workshop",
    author: "Priya Nair",
    readTime: "5 min",
    category: "Workshops",
    image: "/ppes/events/my_health_my_growth/mhmg3.jpg",
    excerpt:
      "Organizing a workshop from scratch taught me more about leadership than any textbook ever could. Here are the key lessons.",
  },
  {
    title: "How Collaboration Beat Competition in Our Hackathon",
    author: "Arjun Patel",
    readTime: "6 min",
    category: "Student Stories",
    image: "/ppes/events/ml_ai_workshop/m5.jpg",
    excerpt:
      "Our team came together with different skills and one shared goal. Here is how we built something meaningful in 24 hours.",
  },
  {
    title: "The Power of Mentorship: Finding Your Guide",
    author: "Sneha Iyer",
    readTime: "4 min",
    category: "Personal Growth",
    image: "/ppes/sabha/IMG-20241201-WA0036.jpg",
    excerpt:
      "A good mentor can change the trajectory of your career. Here is how I found mine and why mentorship is worth seeking out.",
  },
  {
    title: "From Shy Student to Confident Speaker",
    author: "Divya R.",
    readTime: "7 min",
    category: "Personal Growth",
    image: "/ppes/events/ml_ai_workshop/m6.jpg",
    excerpt:
      "My journey from dreading presentations to actively seeking speaking opportunities, and the one workshop that changed it all.",
  },
  {
    title: "Building Communities That Last Beyond College",
    author: "Rahul Sharma",
    readTime: "5 min",
    category: "Leadership",
    image: "/ppes/events/ml_ai_workshop/m7.jpg",
    excerpt:
      "College communities often dissolve after graduation. Here is how Prarambha Path is building connections that endure.",
  },
  {
    title: "Design Thinking: Not Just for Designers",
    author: "Prof. Karan Mehta",
    readTime: "6 min",
    category: "Workshops",
    image: "/ppes/events/my_health_my_growth/mhmg4.jpg",
    excerpt:
      "Design thinking is a problem-solving framework that every student should learn, regardless of their field of study.",
  },
]

export function BlogGrid() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Latest Articles
        </span>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          From Our Community
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.title}
              href="/blog"
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {article.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
