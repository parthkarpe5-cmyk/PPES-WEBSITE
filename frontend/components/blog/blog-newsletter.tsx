"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-foreground p-10 text-center md:p-14">
          <h2 className="text-2xl font-bold text-background md:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mt-3 text-background/60">
            Subscribe to our newsletter for the latest articles, event updates,
            and community stories delivered straight to your inbox.
          </p>
          {submitted ? (
            <div className="mt-8 rounded-lg bg-primary/10 p-4">
              <p className="font-semibold text-primary">
                Thank you for subscribing!
              </p>
              <p className="mt-1 text-sm text-background/60">
                You will receive our next newsletter soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-lg border border-background/10 bg-background/5 px-4 py-3 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#E55F00]"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
