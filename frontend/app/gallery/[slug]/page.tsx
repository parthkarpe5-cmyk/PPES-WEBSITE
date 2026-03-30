"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Calendar,
    MapPin,
    X,
    ChevronLeft,
    ChevronRight,
    Quote,
    Play,
} from "lucide-react"
import { getGalleryItem } from "@/lib/gallery-data"

function Lightbox({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: {
    images: { src: string; alt: string }[]
    currentIndex: number
    onClose: () => void
    onPrev: () => void
    onNext: () => void
}) {
    const image = images[currentIndex]
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Close lightbox"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Previous */}
            {images.length > 1 && (
                <button
                    onClick={onPrev}
                    className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {/* Image container */}
            <div className="flex max-h-[80vh] max-w-[90vw] flex-col items-center">
                <div className="relative flex h-[70vh] w-[80vw] items-center justify-center rounded-xl overflow-hidden bg-black/50">
                    <Image src={image.src} alt={image.alt} fill className="object-contain" />
                </div>
                <p className="mt-3 text-sm text-white/60">{image.alt}</p>
            </div>

            {/* Next */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}

export default function GalleryDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const item = getGalleryItem(slug)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    if (!item) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl">🔍</p>
                    <h1 className="mt-4 text-2xl font-bold text-[#1F4E79]">
                        Gallery Item Not Found
                    </h1>
                    <Link
                        href="/gallery"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2FA8CC] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2FA8CC]/90"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Gallery
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={item.images}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() =>
                        setLightboxIndex(
                            (lightboxIndex - 1 + item.images.length) % item.images.length
                        )
                    }
                    onNext={() =>
                        setLightboxIndex((lightboxIndex + 1) % item.images.length)
                    }
                />
            )}

            {/* Large header */}
            <section className="relative flex h-72 items-end md:h-96 overflow-hidden">
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative mx-auto w-full max-w-7xl px-6 pb-10">
                    <Link
                        href="/gallery"
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Gallery
                    </Link>
                    <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        {item.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/75">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {item.date}
                        </span>
                        {item.location && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {item.location}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Description */}
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-xl font-bold text-[#1F4E79]">About This Event</h2>
                        <div className="mt-2 h-1 w-12 rounded-full bg-[#C9A227]" />
                        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                            {item.description}
                        </p>
                    </div>

                    {/* Image grid */}
                    <div className="mt-16">
                        <h2 className="text-xl font-bold text-[#1F4E79]">Photo Gallery</h2>
                        <div className="mt-2 h-1 w-12 rounded-full bg-[#C9A227]" />
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {item.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setLightboxIndex(index)}
                                    className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-muted transition-all hover:shadow-lg"
                                    style={{ aspectRatio: index === 0 ? "16/12" : "4/3" }}
                                >
                                    <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-transparent transition-all group-hover:bg-black/30">
                                        <div className="scale-0 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform group-hover:scale-100">
                                            <Play className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
                                        {img.alt}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Video embed placeholder */}
                    {item.videoUrl && (
                        <div className="mt-16">
                            <h2 className="text-xl font-bold text-[#1F4E79]">Video</h2>
                            <div className="mt-2 h-1 w-12 rounded-full bg-[#C9A227]" />
                            <div className="mt-8 flex aspect-video items-center justify-center rounded-xl bg-[#1F4E79]/5">
                                <p className="text-muted-foreground">Video coming soon</p>
                            </div>
                        </div>
                    )}

                    {/* Student quote */}
                    {item.studentQuote && (
                        <div className="mx-auto mt-16 max-w-2xl">
                            <div className="flex flex-col items-center rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/5 px-8 py-10 text-center">
                                <Quote className="h-8 w-8 text-[#C9A227]" />
                                <blockquote className="mt-4 text-lg font-medium italic leading-relaxed text-[#1F4E79]">
                                    &ldquo;{item.studentQuote.text}&rdquo;
                                </blockquote>
                                <cite className="mt-4 text-sm font-semibold not-italic text-muted-foreground">
                                    — {item.studentQuote.author}
                                </cite>
                            </div>
                        </div>
                    )}

                    {/* Back button */}
                    <div className="mt-16 text-center">
                        <Link
                            href="/gallery"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#2FA8CC] px-7 py-3.5 text-sm font-semibold text-[#2FA8CC] transition-all hover:bg-[#2FA8CC] hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Gallery
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
