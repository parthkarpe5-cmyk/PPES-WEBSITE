"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How can I join Prarambha Path?",
    answer:
      "You can join by filling out the contact form on this page or by reaching out to us via email. We welcome students, mentors, and institutions who share our vision of growth and impact.",
  },
  {
    question: "Are the events free to attend?",
    answer:
      "Most of our events and workshops are free or have a nominal registration fee. We believe in making learning accessible to all students regardless of financial background.",
  },
  {
    question: "Can my college or institution partner with you?",
    answer:
      "Absolutely! We actively collaborate with educational institutions to host events, workshops, and outreach programs. Reach out through the form or email us at hello@prarambhapath.org.",
  },
  {
    question: "How can I become a speaker or mentor?",
    answer:
      "We are always looking for experienced professionals and educators who want to give back. Share your interest through our contact form with the subject 'Partnership / Collaboration' and we will connect with you.",
  },
  {
    question: "Do you offer certificates for workshops?",
    answer:
      "Yes, participants who complete our workshops receive certificates of participation. Select workshops also offer certificates of excellence for top performers.",
  },
]

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Quick answers to common questions about Prarambha Path.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border bg-card"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="pr-4 text-sm font-semibold text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180 text-primary"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-border px-6 py-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
