import { EventsModule } from "@/components/events/events-module"

export const metadata = {
  title: "Admin Events Portal | PPES",
  description: "Publish masterclasses, workshops, and manage student registrations.",
}

export default function AdminEventsPage() {
  return (
    <main className="w-full">
      <EventsModule isAdmin={true} />
    </main>
  )
}
