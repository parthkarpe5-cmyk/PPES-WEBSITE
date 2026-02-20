import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#1F4E79] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="P.P.E.S. Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div>
                <span className="text-lg font-bold tracking-tight">P.P.E.S.</span>
                <p className="text-xs text-white/50">Since 2024</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Prarambha Path Evening School — Empowering students in Savardhat
              through experiential learning, Gurukul values, and holistic growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "#about", label: "About Us" },
                { href: "#vision", label: "Our Vision" },
                { href: "#journey", label: "Our Journey" },
                { href: "#acharya", label: "Acharya Mandal" },
                { href: "#connect", label: "Contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[#C9A227]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2FA8CC]" />
                <span className="text-sm text-white/60">
                  Savardhat Village, Bicholim Taluka, Goa
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#2FA8CC]" />
                <a
                  href="mailto:prarambhapath@gmail.com"
                  className="text-sm text-white/60 transition-colors hover:text-[#C9A227]"
                >
                  prarambhapath@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#2FA8CC]" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-white/60 transition-colors hover:text-[#C9A227]"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Prarambha Path Evening School. All
            rights reserved.
          </p>
          <p className="text-xs text-white/30">
            A student-led initiative from Savardhat, Goa
          </p>
        </div>
      </div>
    </footer>
  )
}
