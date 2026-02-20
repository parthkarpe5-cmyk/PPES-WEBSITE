import { Mail, Phone, MapPin, Quote } from "lucide-react"

export function ClosingSection() {
    return (
        <section id="connect" className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Contact Info */}
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#2FA8CC]">
                        Get In Touch
                    </span>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#1F4E79] md:text-4xl">
                        Let&apos;s Build Something Meaningful Together
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#C9A227]" />
                </div>

                <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-3">
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

                    <div className="flex flex-col items-center rounded-2xl border border-border bg-[#E8F6FA]/50 p-8 text-center transition-all hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2FA8CC]/10">
                            <Mail className="h-6 w-6 text-[#2FA8CC]" />
                        </div>
                        <h3 className="mt-4 font-semibold text-[#1F4E79]">Email</h3>
                        <a
                            href="mailto:prarambhapath@gmail.com"
                            className="mt-2 text-sm text-muted-foreground transition-colors hover:text-[#2FA8CC]"
                        >
                            prarambhapath@gmail.com
                        </a>
                    </div>

                    <div className="flex flex-col items-center rounded-2xl border border-border bg-[#E8F6FA]/50 p-8 text-center transition-all hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2FA8CC]/10">
                            <Phone className="h-6 w-6 text-[#2FA8CC]" />
                        </div>
                        <h3 className="mt-4 font-semibold text-[#1F4E79]">Phone</h3>
                        <a
                            href="tel:+919876543210"
                            className="mt-2 text-sm text-muted-foreground transition-colors hover:text-[#2FA8CC]"
                        >
                            +91 98765 43210
                        </a>
                    </div>
                </div>

                {/* Final Quote */}
                <div className="mt-20 rounded-2xl bg-gradient-to-r from-[#1F4E79] via-[#2FA8CC] to-[#1F4E79] px-8 py-14 text-center md:px-16">
                    <Quote className="mx-auto h-10 w-10 text-[#C9A227]" />
                    <blockquote className="mx-auto mt-6 max-w-3xl text-2xl font-bold leading-relaxed text-white md:text-3xl">
                        &ldquo;Education must shape character before careers.&rdquo;
                    </blockquote>
                    <div className="mx-auto mt-4 h-0.5 w-20 bg-[#C9A227]" />
                    <p className="mt-6 text-sm font-medium text-white/60">
                        Prarambha Path Evening School · Since 2024
                    </p>
                </div>
            </div>
        </section>
    )
}
