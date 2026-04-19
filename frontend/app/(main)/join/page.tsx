"use client"

import { useState } from "react"
import { UserPlus, CheckCircle, Heart, Users, BookOpen, Lightbulb } from "lucide-react"

// 👉 Replace with your actual Formspree form ID from https://formspree.io
const FORMSPREE_JOIN_URL = "https://formspree.io/f/YOUR_JOIN_FORM_ID"

const roles = [
  "Student",
  "Volunteer Teacher / Mentor",
  "Event Organizer",
  "Donor / Supporter",
  "Parent / Guardian",
  "Skill Trainer (Art, Music, Sports, etc.)",
  "Other",
]

const reasons = [
  { icon: Heart, text: "Passionate about community education" },
  { icon: Users, text: "Want to mentor young minds" },
  { icon: BookOpen, text: "Believe in experiential learning" },
  { icon: Lightbulb, text: "Share skills and expertise" },
]

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    village: "",
    role: "",
    motivation: "",
    availability: "",
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
      const res = await fetch(FORMSPREE_JOIN_URL, {
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
    <main className="min-h-screen bg-secondary">
      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron via-orange-600 to-deep-blue px-6 py-24 text-center text-white font-display">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
          Be Part of the Change
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Join Us
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
          Whether you&apos;re a student, mentor, volunteer, or supporter —
          there&apos;s a place for you at Prarambha Path.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Sidebar */}
          <aside className="lg:col-span-2">
            <h2 className="text-xl font-bold text-deep-blue font-display">Why Join Us?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Prarambha Path Evening School is a student-led movement built on
              Gurukul values, experiential learning, and holistic growth. Every
              person who joins strengthens the mission.
            </p>

             <div className="mt-8 flex flex-col gap-4">
              {reasons.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron/10">
                    <Icon className="h-5 w-5 text-saffron" />
                  </div>
                  <p className="text-sm text-gray-700">{text}</p>
                </div>
              ))}
            </div>

            {/* Decorative */}
            <div className="mt-10 rounded-2xl bg-gradient-to-br from-saffron to-deep-blue p-6 text-white">
              <p className="text-sm font-medium">
                &ldquo;The best way to find yourself is to lose yourself in the
                service of others.&rdquo;
              </p>
              <p className="mt-3 text-xs text-white/60">— Mahatma Gandhi</p>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <CheckCircle className="h-8 w-8 text-saffron" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-deep-blue font-display">
                  Welcome to the Family! 🎉
                </h3>
                <p className="mt-2 max-w-sm text-gray-500">
                  Thank you for expressing your interest. Our team will review
                  your details and reach out within 2–3 days.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      age: "",
                      village: "",
                      role: "",
                      motivation: "",
                      availability: "",
                    })
                  }}
                    className="mt-6 rounded-lg border border-saffron px-5 py-2.5 text-sm font-semibold text-saffron transition-colors hover:bg-saffron hover:text-white"
                  >
                    Submit Another Response
                  </button>
              </div>
            ) : (
               <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10"
              >
                <h2 className="text-xl font-bold text-deep-blue font-display">
                  Your Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in your information and we&apos;ll get in touch soon.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="join-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      id="join-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                       onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-saffron focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron transition-colors"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label
                      htmlFor="join-age"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Age
                    </label>
                    <input
                      id="join-age"
                      name="age"
                      type="number"
                      min="5"
                      max="100"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="e.g. 22"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="join-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address *
                    </label>
                    <input
                      id="join-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="join-phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="join-phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                    />
                  </div>

                  {/* Village */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="join-village"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Village / City
                    </label>
                    <input
                      id="join-village"
                      name="village"
                      type="text"
                      value={form.village}
                      onChange={handleChange}
                      placeholder="e.g. Savardhat, Goa"
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition-colors"
                    />
                  </div>

                  {/* Role */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="join-role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      How would you like to contribute? *
                    </label>
                    <select
                      id="join-role"
                      name="role"
                       required
                      value={form.role}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:border-saffron focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron transition-colors"
                    >
                      <option value="">Select your role</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="join-availability"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Availability
                    </label>
                    <select
                      id="join-availability"
                        name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:border-saffron focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron transition-colors"
                    >
                      <option value="">Select availability</option>
                      {[
                        "Weekday evenings",
                        "Weekends only",
                        "Both weekdays & weekends",
                        "Flexible / Remote",
                      ].map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Motivation */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="join-motivation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Why do you want to join? *
                    </label>
                    <textarea
                      id="join-motivation"
                      name="motivation"
                      required
                      rows={4}
                      value={form.motivation}
                       onChange={handleChange}
                      placeholder="Tell us a little about yourself and why this matters to you…"
                      className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-saffron focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron transition-colors"
                    />
                  </div>
                </div>

                 <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-saffron px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-60"
                >
                  {loading ? "Submitting…" : "Join the Movement"}
                  <UserPlus className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
