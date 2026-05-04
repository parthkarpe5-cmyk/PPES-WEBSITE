"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Calendar,
    MapPin,
    Users,
    ArrowRight,
} from "lucide-react"
import {
    galleryItems,
    categoryLabels,
    type GalleryCategory,
    type GalleryItem,
} from "@/lib/gallery-data"

function GalleryCard({ item }: { item: GalleryItem }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-xl hover:shadow-sky/8">
            {/* Thumbnail Image */}
            <div className="relative flex h-52 items-center justify-center overflow-hidden">
                {item.thumbnailHeaderStyle ? (
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={item.thumbnailHeaderStyle}
                    />
                ) : (
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent transition-all group-hover:bg-black/20 z-10" />
                {/* Category badge */}
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {categoryLabels[item.category]}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-deep-blue group-hover:text-sky transition-colors font-display">
                    {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.shortDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-sky" />
                        {item.date}
                    </span>
                    {item.location && (
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-saffron" />
                            {item.location}
                        </span>
                    )}
                    {item.participants && (
                        <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-gold" />
                            {item.participants}
                        </span>
                    )}
                </div>

                <Link
                    href={`/gallery/${item.slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-saffron/10 px-4 py-2.5 text-sm font-semibold text-saffron transition-all hover:bg-saffron hover:text-white"
                >
                    View Gallery
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}

const categories: (GalleryCategory | "all")[] = [
    "all",
    "events",
    "trips",
    "competitions",
]

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState<GalleryCategory | "all">(
        "all"
    )

    const filtered =
        activeFilter === "all"
            ? galleryItems
            : galleryItems.filter((item) => item.category === activeFilter)

    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-deep-blue to-sky py-20">
                <div className="mx-auto max-w-7xl px-6 text-center font-display">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                        Gallery
                    </span>
                    <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                        Moments That Define Us
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-white/65">
                        A visual journey through our events, trips, and competitions.
                        Every moment tells a story of growth and impact.
                    </p>
                </div>
            </section>

            {/* Filter + Cards */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Filter tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${activeFilter === cat
                                        ? "bg-sky text-white shadow-md shadow-sky/20"
                                        : "border border-border bg-white text-muted-foreground hover:border-sky hover:text-sky"
                                    }`}
                            >
                                {categoryLabels[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Category section headers */}
                    {activeFilter === "all" ? (
                        <>
                            {(["events", "trips", "competitions"] as GalleryCategory[]).map(
                                (cat) => {
                                    const items = galleryItems.filter(
                                        (i) => i.category === cat
                                    )
                                    if (items.length === 0) return null
                                    return (
                                         <div key={cat} className="mt-14">
                                            <h2 className="text-2xl font-bold text-deep-blue font-display">
                                                {categoryLabels[cat]}
                                            </h2>
                                            <div className="mt-2 h-1 w-12 rounded-full bg-gold" />
                                            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                                {items.map((item) => (
                                                    <GalleryCard key={item.slug} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </>
                    ) : (
                        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((item) => (
                                <GalleryCard key={item.slug} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
