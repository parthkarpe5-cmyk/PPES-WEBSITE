"use client"

import { MapPin, Mail, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-secondary">
      {/* Hero */}
      <section className="bg-gradient-to-br from-deep-blue via-[#1a4570] to-sky px-6 py-24 text-center text-white">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold font-display">
          Reach Out
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl font-display">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
          Have a question, suggestion, or want to collaborate? We&apos;d love to
          hear from you.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Info sidebar */}
          <aside className="lg:col-span-2">
            <h2 className="text-xl font-bold text-deep-blue font-display">Get in Touch</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Fill out the form and our team will get back to you within 24–48
              hours.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Savardhat Village, Bicholim Taluka, Goa",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "prarambhpath4444@gmail.com",
                  href: "mailto:prarambhpath4444@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 9689858940",
                  href: "tel:+919689858940",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky/10">
                    <Icon className="h-5 w-5 text-sky" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold font-display">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-0.5 text-sm text-gray-600 transition-colors hover:text-sky"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-gray-600">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative card */}
            <div className="mt-10 rounded-2xl bg-gradient-to-br from-deep-blue to-sky p-6 text-white">
              <p className="text-sm font-medium">
                &ldquo;Education must shape character before careers.&rdquo;
              </p>
              <p className="mt-3 text-xs text-white/60">
                — Prarambha Path Evening School
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
