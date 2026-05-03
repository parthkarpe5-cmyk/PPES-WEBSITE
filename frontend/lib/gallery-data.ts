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
    thumbnailRotate?: number
    thumbnailHeaderStyle?: any
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
        participants: "30+ students",
        thumbnail: "/ppes/events/sports_day/s2.jpg",
        images: [

            { src: "/ppes/events/sports_day/s2.jpg", alt: "Students competing on the field" },
            { src: "/ppes/events/sports_day/s3.jpg", alt: "Group celebration at Sports Day" },
        ],
        studentQuote: {
            text: "I never knew running could feel so good when your friends are cheering for you.",
            author: "Student, 8th Standard",
        },
        gradient: "from-green-500 to-emerald-700",
        icon: "🏅",
    },
    // {
    //     slug: "cultural-event",
    //     title: "Cultural Event",
    //     category: "events",
    //     date: "September 2024",
    //     location: "Savardhat Community Hall",
    //     description:
    //         "An evening dedicated to celebrating our roots. Students performed traditional Goan folk dances, sang Konkani songs, enacted short plays about village life, and showcased their oratory skills. The stage was theirs — and they owned it with pride and grace.",
    //     shortDescription:
    //         "Celebrating roots through folk dance, music, and drama.",
    //     thumbnail: "/ppes/events/my_health_my_growth/mhmg10.jpg",
    //     images: [
    //         { src: "/ppes/events/my_health_my_growth/mhmg12.jpg", alt: "Traditional dance performance" },
    //         { src: "/ppes/events/my_health_my_growth/mhmg13.jpg", alt: "Students singing Konkani songs" },
    //         { src: "/ppes/events/my_health_my_growth/mhmg14.jpg", alt: "Drama skit about village life" },
    //         { src: "/ppes/events/my_health_my_growth/mhmg15.jpg", alt: "Audience enjoying the show" },
    //     ],
    //     studentQuote: {
    //         text: "Performing in front of everyone made me realize I can do things I never imagined.",
    //         author: "Student, 9th Standard",
    //     },
    //     gradient: "from-purple-500 to-indigo-700",
    //     icon: "🎭",
    // },
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
            { src: "/ppes/events/my_health_my_growth/mhmg3.jpg", alt: "Stdents and Parents" },
            { src: "/ppes/events/my_health_my_growth/mhmg4.jpg", alt: "Event poster" },
            { src: "/ppes/events/my_health_my_growth/mhmg5.jpg", alt: "The core team!!" },
            { src: "/ppes/events/my_health_my_growth/mhmg6.jpg", alt: "A way of thank you to MAM" },
            { src: "/ppes/events/my_health_my_growth/mhmg7.jpg", alt: "prize to student " },
            { src: "/ppes/events/my_health_my_growth/mhmg8.jpg", alt: "prize to parent" },
            { src: "/ppes/events/my_health_my_growth/mhmg9.jpg", alt: "THANK YOU Vasant Sir" },
            { src: "/ppes/events/my_health_my_growth/mhmg10.jpg", alt: "PPES - One family " },
            { src: "/ppes/events/my_health_my_growth/mhmg11.jpg", alt: "Closing ceremony" },
            { src: "/ppes/events/my_health_my_growth/mhmg13.jpg", alt: "Health check-up station" },
            { src: "/ppes/events/my_health_my_growth/mhmg14.jpg", alt: "Dr. Amita addressing students" },
            { src: "/ppes/events/my_health_my_growth/mhmg15.jpg", alt: "Token of love to Dr Amita from Vasant sir , along with Priti Tr and Nitin Sir" },
            { src: "/ppes/events/my_health_my_growth/mhmg16.jpg", alt: "prize to student" },
            { src: "/ppes/events/my_health_my_growth/mhmg17.jpg", alt: "prize to student" },
            { src: "/ppes/events/my_health_my_growth/mhmg18.jpg", alt: "Priti teacher's Margadarshan" }
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
        thumbnailRotate: 0,
        thumbnailHeaderStyle: {
            position: "absolute",
            height: "200%",
            width: "100%",
            left: 0,
            top: "-95px",
            right: 0,
            bottom: 0,
            transform: "rotate(-90deg)",
            rotate: "0deg",
            transformOrigin: "center",
            color: "transparent",
        },
        images: [
            { src: "/ppes/events/ml_ai_workshop/m2.jpg", alt: "Students exploring ML concepts" },
            { src: "/ppes/events/ml_ai_workshop/m3.jpg", alt: "Interactive coding session" },
            { src: "/ppes/events/ml_ai_workshop/m4.jpg", alt: "Group discussion on AI applications" },
            { src: "/ppes/events/ml_ai_workshop/m5.jpg", alt: "Hands-on ML activity" },
            { src: "/ppes/events/ml_ai_workshop/m6.jpg", alt: "Students working on models" },
            { src: "/ppes/events/ml_ai_workshop/m7.jpg", alt: "Workshop session in progress" },
            { src: "/ppes/events/ml_ai_workshop/m9.jpg", alt: "AI concepts being explained" },
            { src: "/ppes/events/ml_ai_workshop/m10.jpg", alt: "Students learning algorithms" },
            { src: "/ppes/events/ml_ai_workshop/m11.jpg", alt: "Team problem-solving" },
            { src: "/ppes/events/ml_ai_workshop/m12.jpg", alt: "Classification model building" },
            { src: "/ppes/events/ml_ai_workshop/m13.jpg", alt: "Collaborative learning session" },
            { src: "/ppes/events/ml_ai_workshop/m14.jpg", alt: "Guided practice on ML tools" },
            { src: "/ppes/events/ml_ai_workshop/m15.jpg", alt: "Students presenting findings" },
            { src: "/ppes/events/ml_ai_workshop/m16.jpg", alt: "Real-world AI applications" },
            { src: "/ppes/events/ml_ai_workshop/m17.jpg", alt: "Instructor-led demonstration" },
            { src: "/ppes/events/ml_ai_workshop/m18.jpg", alt: "Group learning activity" },
            { src: "/ppes/events/ml_ai_workshop/m19.jpg", alt: "Students engaged in workshop" },
            { src: "/ppes/events/ml_ai_workshop/m20.jpg", alt: "Coding and exploration" },
            { src: "/ppes/events/ml_ai_workshop/m21.jpg", alt: "Workshop highlights" },
            { src: "/ppes/events/ml_ai_workshop/m22.jpg", alt: "Technology exploration" },
            { src: "/ppes/events/ml_ai_workshop/m23.jpg", alt: "Students at ML workshop" },
            { src: "/ppes/events/ml_ai_workshop/m24.jpg", alt: "Learning AI fundamentals" },
            { src: "/ppes/events/ml_ai_workshop/m25.jpg", alt: "Interactive session moment" },
            { src: "/ppes/events/ml_ai_workshop/m26.jpg", alt: "Workshop discussion" },
            { src: "/ppes/events/ml_ai_workshop/m27.jpg", alt: "Students experimenting with data" },
            { src: "/ppes/events/ml_ai_workshop/m28.jpg", alt: "Collaborative AI activity" },
            { src: "/ppes/events/ml_ai_workshop/m29.jpg", alt: "Group photo at workshop" },
            { src: "/ppes/events/ml_ai_workshop/m30.jpg", alt: "Final workshop session" },
            { src: "/ppes/events/ml_ai_workshop/m31.jpg", alt: "Students with instructor" },
            { src: "/ppes/events/ml_ai_workshop/m32.jpg", alt: "ML workshop wrap-up" },
            { src: "/ppes/events/ml_ai_workshop/m33.jpg", alt: "Technology and learning" },
            { src: "/ppes/events/ml_ai_workshop/m34.jpg", alt: "Knowledge sharing session" },
            { src: "/ppes/events/ml_ai_workshop/m35.jpg", alt: "Workshop closing moment" },
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
            { src: "/ppes/trips/panjim_trip/p1.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p2.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p3.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p4.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p5.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p6.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p7.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p8.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p9.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p10.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p11.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p12.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p13.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p14.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p15.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p16.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p17.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p18.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p19.jpg", alt: "" },
            { src: "/ppes/trips/panjim_trip/p20.jpg", alt: "" },
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
            { src: "/ppes/trips/nature_hunt/n1.jpeg", alt: "Nature Hunt beginning" },
            { src: "/ppes/trips/nature_hunt/n2.jpeg", alt: "Students on the forest trail" },
            { src: "/ppes/trips/nature_hunt/n3.jpeg", alt: "Identifying local plant species" },
            { src: "/ppes/trips/nature_hunt/n4.jpeg", alt: "Stream crossing adventure" },
            { src: "/ppes/trips/nature_hunt/n5.jpeg", alt: "Group reflection session outdoors" },
            { src: "/ppes/trips/nature_hunt/n6.jpeg", alt: "Exploring forest biodiversity" },
            { src: "/ppes/trips/nature_hunt/n7.jpeg", alt: "Documenting nature findings" },
            { src: "/ppes/trips/nature_hunt/n8.jpeg", alt: "Students in the forest" },
            { src: "/ppes/trips/nature_hunt/n9.jpeg", alt: "Nature observation activity" },
            { src: "/ppes/trips/nature_hunt/n10.jpeg", alt: "Group photo at nature hunt" },
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
        title: "Prarambh — Path in Savardhat",
        category: "competitions",
        date: "October 2024",
        location: "Savardhat Village School",
        description: "",
        shortDescription:
            "Prarambh — the beginning of creativity and expression at Savardhat.",
        participants: "35+ students",
        thumbnail: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0006.jpg",
        images: [
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0010.jpg", alt: "" },
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0024.jpg", alt: "" },
            { src: "/ppes/shiksha_sarvarthi/IMG-20240615-WA0026.jpg", alt: "" },
        ],
        gradient: "from-pink-500 to-fuchsia-700",
        icon: "🎨",
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
