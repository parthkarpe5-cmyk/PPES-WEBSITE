export type GalleryCategory = "events" | "trips" | "competitions"

export interface GalleryImage {
    src: string
    alt: string
}

export interface GalleryItem {
    slug: string
    title: string
    category: GalleryCategory
    date: string
    location?: string
    description: string
    shortDescription: string
    participants?: string
    thumbnail: string
    images: GalleryImage[]
    videoUrl?: string
    studentQuote?: {
        text: string
        author: string
    }
    gradient: string
    icon: string
}

export const galleryItems: GalleryItem[] = [
    // ── Events & Workshops ─────────────────────────
    {
        slug: "sports-day",
        title: "Sports Day",
        category: "events",
        date: "August 2024",
        location: "Savardhat Village Ground",
        description:
            "Our inaugural Sports Day brought the entire village together. Students competed in races, tug-of-war, kabaddi, and relay events. It was more than competition — it was about building teamwork, discipline, and sportsmanship. Teachers and parents cheered from the sidelines as young athletes discovered their strength.",
        shortDescription:
            "A day of sportsmanship and teamwork across village grounds.",
        participants: "50+ students",
        thumbnail: "/ppes/sabha/IMG-20241014-WA0020.jpg",
        images: [
            { src: "/ppes/sabha/IMG-20241201-WA0014.jpg", alt: "Students ready for the 100m race" },
            { src: "/ppes/sabha/IMG-20241201-WA0028.jpg", alt: "Tug of war championship" },
            { src: "/ppes/sabha/IMG-20241201-WA0033.jpg", alt: "Winners receiving medals" },
            { src: "/ppes/sabha/IMG-20241201-WA0008.jpg", alt: "Group photo after the event" },
        ],
        studentQuote: {
            text: "I never knew running could feel so good when your friends are cheering for you.",
            author: "Student, 8th Standard",
        },
        gradient: "from-green-500 to-emerald-700",
        icon: "🏅",
    },
    {
        slug: "cultural-event",
        title: "Cultural Event",
        category: "events",
        date: "September 2024",
        location: "Savardhat Community Hall",
        description:
            "An evening dedicated to celebrating our roots. Students performed traditional Goan folk dances, sang Konkani songs, enacted short plays about village life, and showcased their oratory skills. The stage was theirs — and they owned it with pride and grace.",
        shortDescription:
            "Celebrating roots through folk dance, music, and drama.",
        thumbnail: "/ppes/events/my_health_my_growth/mhmg10.jpg",
        images: [
            { src: "/ppes/events/my_health_my_growth/mhmg12.jpg", alt: "Traditional dance performance" },
            { src: "/ppes/events/my_health_my_growth/mhmg13.jpg", alt: "Students singing Konkani songs" },
            { src: "/ppes/events/my_health_my_growth/mhmg14.jpg", alt: "Drama skit about village life" },
            { src: "/ppes/events/my_health_my_growth/mhmg15.jpg", alt: "Audience enjoying the show" },
        ],
        studentQuote: {
            text: "Performing in front of everyone made me realize I can do things I never imagined.",
            author: "Student, 9th Standard",
        },
        gradient: "from-purple-500 to-indigo-700",
        icon: "🎭",
    },
    {
        slug: "healthcare-camp",
        title: "Healthcare Camp",
        category: "events",
        date: "September 2024",
        location: "Savardhat Village",
        description:
            "Dr. Amita Suryawanshi led a health awareness session covering hygiene, nutrition, and preventive care. Students learned about basic first aid, the importance of clean water, and how simple habits can transform health outcomes. Villagers were also invited, making it a community-wide event.",
        shortDescription:
            "Health awareness session led by Dr. Amita Suryawanshi.",
        thumbnail: "/ppes/events/my_health_my_growth/mhmg1.jpg",
        images: [
            { src: "/ppes/events/my_health_my_growth/mhmg2.jpg", alt: "Dr. Amita addressing students" },
            { src: "/ppes/events/my_health_my_growth/mhmg3.jpg", alt: "Hands-on first aid training" },
            { src: "/ppes/events/my_health_my_growth/mhmg4.jpg", alt: "Health check-up station" },
        ],
        studentQuote: {
            text: "We learned that staying healthy starts with small decisions every day.",
            author: "Student, 7th Standard",
        },
        gradient: "from-rose-500 to-red-700",
        icon: "🏥",
    },
    {
        slug: "ml-workshop",
        title: "Machine Learning Workshop",
        category: "events",
        date: "November 2024",
        location: "Savardhat Village School",
        description:
            "A hands-on introductory workshop on Machine Learning concepts. Students explored how computers learn from data, built simple classification models, and understood AI's real-world applications. The workshop bridged the gap between rural education and cutting-edge technology.",
        shortDescription:
            "Introducing rural students to the world of AI and ML.",
        thumbnail: "/ppes/events/ml_ai_workshop/m1.jpg",
        images: [
            { src: "/ppes/events/ml_ai_workshop/m2.jpg", alt: "Students exploring ML concepts" },
            { src: "/ppes/events/ml_ai_workshop/m3.jpg", alt: "Interactive coding session" },
            { src: "/ppes/events/ml_ai_workshop/m4.jpg", alt: "Group discussion on AI applications" },
        ],
        gradient: "from-cyan-500 to-blue-700",
        icon: "🤖",
    },

    // ── Trips ─────────────────────────────────────
    {
        slug: "panjim-museum-trip",
        title: "Panjim Museum Trip",
        category: "trips",
        date: "October 2024",
        location: "Panjim, Goa",
        description:
            "Students visited Miramar Beach, the Goa Science Centre, Yog Path, and the State Museum in Panjim. For many, this was their first trip outside the village. They explored Goa's history, touched science exhibits, walked along the sea, and returned with stories that changed how they see their own world.",
        shortDescription:
            "Exploring Panjim — Miramar, Science Centre, Museum, and more.",
        thumbnail: "/ppes/trips/panjim_trip/p1.jpg",
        images: [
            { src: "/ppes/trips/panjim_trip/p2.jpg", alt: "Students at Miramar Beach" },
            { src: "/ppes/trips/panjim_trip/p3.jpg", alt: "Inside the Science Centre" },
            { src: "/ppes/trips/panjim_trip/p4.jpg", alt: "Exploring the State Museum" },
            { src: "/ppes/trips/panjim_trip/p5.jpg", alt: "Group photo at Yog Path" },
            { src: "/ppes/trips/panjim_trip/p6.jpg", alt: "Students on the bus back home" },
        ],
        studentQuote: {
            text: "There was so much to learn in our own area, but today it felt different and more beautiful.",
            author: "Student, Panjim Field Trip",
        },
        gradient: "from-amber-500 to-orange-700",
        icon: "🚌",
    },
    {
        slug: "nature-hunt-trip",
        title: "Nature Hunt Trip",
        category: "trips",
        date: "November 2024",
        location: "Savardhat Forest Area",
        description:
            "An environmental awareness walk through the village's natural landscape. Students identified local plant species, learned about biodiversity, discussed deforestation impacts, and documented their findings. The trip reinforced the idea that education can happen anywhere — especially in nature.",
        shortDescription:
            "Discovering biodiversity and environmental awareness in our own backyard.",
        thumbnail: "/ppes/trips/nature_hunt/n1.jpeg",
        images: [
            { src: "/ppes/trips/nature_hunt/n2.jpeg", alt: "Students on the forest trail" },
            { src: "/ppes/trips/nature_hunt/n3.jpeg", alt: "Identifying local plant species" },
            { src: "/ppes/trips/nature_hunt/n4.jpeg", alt: "Stream crossing adventure" },
            { src: "/ppes/trips/nature_hunt/n5.jpeg", alt: "Group reflection session outdoors" },
        ],
        studentQuote: {
            text: "I walk past these trees every day, but today I actually saw them for the first time.",
            author: "Student, 8th Standard",
        },
        gradient: "from-green-600 to-teal-800",
        icon: "🌿",
    },

    // ── Competitions ──────────────────────────────
    {
        slug: "painting-competition",
        title: "Painting Competition",
        category: "competitions",
        date: "October 2024",
        location: "Savardhat Village School",
        description:
            "Students expressed their creativity through art, painting themes like 'My Dream Village', 'Future of Goa', and 'My Favourite Teacher'. The artwork revealed incredible imagination and pride in their surroundings. Winners were awarded handmade certificates and art supplies.",
        shortDescription:
            "Creativity on canvas — students paint their dreams and roots.",
        participants: "35+ students",
        thumbnail: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0006.jpg",
        images: [
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0010.jpg", alt: "Student focused on painting" },
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0024.jpg", alt: "Colourful artworks on display" },
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0026.jpg", alt: "Winners with certificates" },
        ],
        gradient: "from-pink-500 to-fuchsia-700",
        icon: "🎨",
    },
    {
        slug: "sports-competition",
        title: "Sports Competition",
        category: "competitions",
        date: "December 2024",
        location: "Savardhat Village Ground",
        description:
            "An inter-class sports tournament featuring cricket, kabaddi, kho-kho, and athletics. Students competed fiercely but fairly, learning the value of discipline, perseverance, and graceful defeat. The event strengthened bonds across different age groups.",
        shortDescription:
            "Inter-class sports tournament building discipline and camaraderie.",
        participants: "40+ students",
        thumbnail: "/ppes/sabha/IMG-20240616-WA0000.jpg",
        images: [
            { src: "/ppes/sabha/IMG-20240622-WA0029.jpg", alt: "Cricket match in progress" },
            { src: "/ppes/sabha/IMG-20240625-WA0011.jpg", alt: "Kabaddi tournament" },
            { src: "/ppes/sabha/IMG-20240626-WA0023.jpg", alt: "Athletics events" },
            { src: "/ppes/sabha/IMG-20240626-WA0025.jpg", alt: "Prize distribution ceremony" },
        ],
        gradient: "from-blue-500 to-indigo-700",
        icon: "🏆",
    },
]

export const categoryLabels: Record<GalleryCategory | "all", string> = {
    all: "All",
    events: "Events & Workshops",
    trips: "Trips",
    competitions: "Competitions",
}

export function getGalleryItem(slug: string): GalleryItem | undefined {
    return galleryItems.find((item) => item.slug === slug)
}

export function getGalleryItemsByCategory(
    category: GalleryCategory | "all"
): GalleryItem[] {
    if (category === "all") return galleryItems
    return galleryItems.filter((item) => item.category === category)
}
