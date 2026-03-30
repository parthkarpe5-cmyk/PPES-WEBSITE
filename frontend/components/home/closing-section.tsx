import Link from "next/link"
import { Mail, Phone, MapPin, Quote, MessageSquare, UserPlus } from "lucide-react"

const socialLinks = [
    {
        label: "YouTube",
        href: "https://youtube.com/@prarambhapath?si=wQcjubXc9SCucgBF",
        bg: "bg-red-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/prarambh_path_44?igsh=OXd5MzUyOHNmNDI3",
        bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        ),
    },
    {
        label: "Spotify",
        href: "https://open.spotify.com/show/20Ah469M6xBubEMBiBZt3Y?si=lYsRyCnkQF6D5QFA04briA",
        bg: "bg-green-500",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
    },
]

export function ClosingSection() {
    return (
        <section id="connect" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                        Get In Touch
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                        Let&apos;s Build Something Meaningful Together
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C9A227]" />
                </div>

                {/* Location card */}
                <div className="mx-auto mt-12 max-w-sm">
                    <div className="flex flex-col items-center rounded-2xl border border-border bg-[#E8F6FA]/50 p-8 text-center transition-all hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2FA8CC]/10">
                            <MapPin className="h-6 w-6 text-[#2FA8CC]" />
                        </div>
                        <h3 className="mt-4 font-semibold text-[#1F4E79]">Location</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            Savardhat Village,
                            <br />
                            Bicholim Taluka, Goa
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/contact"
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#2FA8CC] bg-white px-8 py-5 text-center font-semibold text-[#1F4E79] transition-all hover:bg-[#2FA8CC] hover:text-white sm:w-auto sm:min-w-[220px]"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2FA8CC]/10 transition-colors group-hover:bg-white/20">
                            <MessageSquare className="h-5 w-5 text-[#2FA8CC] group-hover:text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold leading-none">Contact Us</p>
                            <p className="mt-1 text-xs font-normal opacity-70">Send us a message</p>
                        </div>
                    </Link>

                    <Link
                        href="/join"
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FF6B00] px-8 py-5 text-center font-semibold text-white transition-all hover:bg-[#e05a00] sm:w-auto sm:min-w-[220px]"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/20">
                            <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold leading-none">Join Us</p>
                            <p className="mt-1 text-xs font-normal opacity-80">Become a part of PPES</p>
                        </div>
                    </Link>
                </div>

                {/* Quick contact sub-line */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <a
                        href="mailto:prarambhapath@gmail.com"
                        className="flex items-center gap-1.5 transition-colors hover:text-[#2FA8CC]"
                    >
                        <Mail className="h-4 w-4" />
                        prarambhapath@gmail.com
                    </a>
                    <a
                        href="tel:+919876543210"
                        className="flex items-center gap-1.5 transition-colors hover:text-[#2FA8CC]"
                    >
                        <Phone className="h-4 w-4" />
                        +91 98765 43210
                    </a>
                </div>

                {/* Social Media Icons */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                        Follow Us
                    </p>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className={`group flex items-center gap-2.5 rounded-xl ${s.bg} px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg`}
                            >
                                {s.icon}
                                <span>{s.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Final Quote */}
                <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#1F4E79] via-[#2FA8CC] to-[#1F4E79] px-8 py-14 text-center md:px-16">
                    <Quote className="mx-auto h-10 w-10 text-[#C9A227]" />
                    <blockquote className="mx-auto mt-6 max-w-3xl text-2xl font-bold leading-relaxed text-white md:text-3xl">
                        &ldquo;Education must shape character before careers.&rdquo;
                    </blockquote>
                    <div className="mx-auto mt-4 h-0.5 w-20 bg-[#C9A227]" />
                    <p className="mt-6 text-sm font-medium text-white/60">
                        Prarambha Path Evening School · Since 2024
                    </p>
                    {/* Social inside banner */}
                    <div className="mt-8 flex items-center justify-center gap-3">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                title={s.label}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/25 hover:scale-110"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
