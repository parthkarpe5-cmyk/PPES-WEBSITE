"use client"

import { useState } from "react"
import { Send, CheckCircle, MapPin, Mail, Phone } from "lucide-react"

// 👉 Replace with your actual Formspree form ID from https://formspree.io
const FORMSPREE_CONTACT_URL = "https://formspree.io/f/YOUR_CONTACT_FORM_ID"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(FORMSPREE_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1F4E79] via-[#1a4570] to-[#2FA8CC] px-6 py-24 text-center text-white">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
          Reach Out
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
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
            <h2 className="text-xl font-bold text-[#1F4E79]">Get in Touch</h2>
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
                  value: "prarambhapath@gmail.com",
                  href: "mailto:prarambhapath@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 98765 43210",
                  href: "tel:+919876543210",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2FA8CC]/10">
                    <Icon className="h-5 w-5 text-[#2FA8CC]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-0.5 text-sm text-gray-600 transition-colors hover:text-[#2FA8CC]"
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
            <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#1F4E79] to-[#2FA8CC] p-6 text-white">
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
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#1F4E79]">
                  Message Sent!
                </h3>
                <p className="mt-2 max-w-sm text-gray-500">
                  Thank you for reaching out. We&apos;ll get back to you within
                  24–48 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: "", email: "", phone: "", subject: "", message: "" })
                  }}
                  className="mt-6 rounded-lg border border-[#2FA8CC] px-5 py-2.5 text-sm font-semibold text-[#2FA8CC] transition-colors hover:bg-[#2FA8CC] hover:text-white"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10"
              >
                <h2 className="text-xl font-bold text-[#1F4E79]">
                  Send Us a Message
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  All fields marked with * are required.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="sm:col-span-2 md:col-span-1">
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#2FA8CC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2FA8CC] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#2FA8CC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2FA8CC] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#2FA8CC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2FA8CC] transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:border-[#2FA8CC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2FA8CC] transition-colors"
                    >
                      <option value="">Select a subject</option>
                      {[
                        "General Inquiry",
                        "Partnership / Collaboration",
                        "Event Hosting",
                        "Workshop Request",
                        "Donation / Support",
                        "Other",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#2FA8CC] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2FA8CC] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F4E79] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2FA8CC] disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Message"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
