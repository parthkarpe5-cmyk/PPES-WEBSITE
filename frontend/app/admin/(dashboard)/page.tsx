import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  TrendingUp,
  Image as ImageIcon,
  Calendar
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Faculties",
      value: "24",
      description: "+2 from last month",
      icon: Users,
    },
    {
      title: "New Inquiries",
      value: "145",
      description: "+15% from last week",
      icon: MessageSquare,
    },
    {
      title: "Gallery Images",
      value: "842",
      description: "Across 12 albums",
      icon: ImageIcon,
    },
    {
      title: "Upcoming Events",
      value: "5",
      description: "Next: Annual Sports Day",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-display">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Check what's happening in your school system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New faculty member added
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Anish G. was added to the Science department.
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Monitor your calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                    24
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Annual Sports Day</div>
                    <div className="text-xs text-muted-foreground">Starts at 9:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                    28
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Science Exhibition</div>
                    <div className="text-xs text-muted-foreground">Main Hall</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                    02
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Parent Teacher Meeting</div>
                    <div className="text-xs text-muted-foreground">Virtual Session</div>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
