import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F4E79] via-[#2FA8CC] to-[#1F4E79]">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#FF6B00] blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#C9A227] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-28 text-center lg:py-40">
        {/* Logo badge */}
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
          <Image
            src="/logo.jpeg"
            alt="P.P.E.S. Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <span className="mb-6 inline-block rounded-full border border-[#C9A227]/40 bg-[#C9A227]/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
          Since 2024 · Savardhat, Goa
        </span>

        <h1 className="max-w-5xl text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Prarambha Path{" "}
          <span className="text-[#FF6B00]">Evening School</span>
        </h1>

        <p className="mt-4 text-xl font-medium tracking-wide text-white/80 md:text-2xl">
          The Initial Path Towards Holistic Success
        </p>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/65">
          A student-led evening school transforming education in Savardhat through
          practical learning, values, and leadership.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/70">
          <MapPin className="h-4 w-4 text-[#FF6B00]" />
          Savardhat Village, Bicholim Taluka, Goa
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="#vision"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            Explore Our Vision
          </Link>
          <Link
            href="#connect"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition-all hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30"
          >
            Join the Movement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
