"use client"

import Image from "next/image"
import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  { src: "/images/gallery-1.jpg", alt: "Community outreach event", event: "Impact Drive 2025" },
  { src: "/images/gallery-2.jpg", alt: "Hackathon collaboration", event: "Hackathon for Good" },
  { src: "/images/gallery-3.jpg", alt: "Award ceremony", event: "Annual Awards 2025" },
  { src: "/images/gallery-4.jpg", alt: "Design thinking workshop", event: "Design Sprint" },
  { src: "/images/gallery-5.jpg", alt: "Panel discussion", event: "Leadership Forum" },
  { src: "/images/gallery-6.jpg", alt: "Campus group discussion", event: "Campus Connect" },
  { src: "/images/hero-bg.jpg", alt: "Workshop session", event: "Workshop Day" },
  { src: "/images/workshop-featured.jpg", alt: "Featured workshop presentation", event: "Public Speaking" },
]

export function GalleryGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % images.length : null))

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <button
              key={image.src}
              onClick={() => openLightbox(index)}
              className="group mb-4 block w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`View ${image.alt}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/40">
                  <div className="translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-sm font-medium text-background">{image.event}</p>
                    <p className="text-xs text-background/70">{image.alt}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-background/10 p-2 text-background transition-colors hover:bg-background/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 rounded-full bg-background/10 p-2 text-background transition-colors hover:bg-background/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 rounded-full bg-background/10 p-2 text-background transition-colors hover:bg-background/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              width={1200}
              height={800}
              className="max-h-[85vh] rounded-lg object-contain"
            />
            <div className="mt-4 text-center">
              <p className="font-medium text-background">{images[lightbox].event}</p>
              <p className="text-sm text-background/60">{images[lightbox].alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
