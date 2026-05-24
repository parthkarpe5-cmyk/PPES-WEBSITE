import { EventsModule } from "@/components/events/events-module"

export const metadata = {
  title: "Events Dashboard | PPES Classroom",
  description: "Register for interactive workshops and special mentorship sessions.",
}

export default function StudentEventsPage() {
  return (
    <main className="w-full">
      <EventsModule isAdmin={false} />
    </main>
  )
}
