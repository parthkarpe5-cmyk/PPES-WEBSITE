import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { VisionSection } from "@/components/home/vision-section"
import { TimelineSection } from "@/components/home/timeline-section"
import { AcharyaSection } from "@/components/home/acharya-section"
import { PlatformsSection } from "@/components/home/platforms-section"
import { ClosingSection } from "@/components/home/closing-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VisionSection />
      <TimelineSection />
      <AcharyaSection />
      <PlatformsSection />
      <ClosingSection />
    </>
  )
}
