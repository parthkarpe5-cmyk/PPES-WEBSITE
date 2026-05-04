'use client'

import { useState } from "react"
import { 
  Plus, 
  Video, 
  MapPin, 
  Clock, 
  MoreVertical, 
  Search,
  BookOpen,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

const initialClasses = [
  {
    id: 1,
    name: "Mathematics Foundations",
    teacher: "Prof. Sharma",
    time: "09:00 AM - 10:30 AM",
    type: "Online",
    link: "https://meet.google.com/abc-defg-hij",
    status: "Upcoming"
  },
  {
    id: 2,
    name: "Experiential Science",
    teacher: "Mrs. Fernandes",
    time: "11:00 AM - 12:30 PM",
    type: "Physical",
    location: "Lab Room 4",
    status: "Ongoing"
  },
  {
    id: 3,
    name: "Leadership Development",
    teacher: "Dr. Kulkarni",
    time: "02:00 PM - 03:30 PM",
    type: "Online",
    link: "https://zoom.us/j/123456789",
    status: "Upcoming"
  }
]

export default function SchedulePage() {
  const [classes, setClasses] = useState(initialClasses)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Class scheduled successfully!")
    // In a real app, you would handle the form data here
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Class Schedule</h1>
          <p className="text-muted-foreground">Manage and monitor classroom and online activities.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sky hover:bg-sky/90 shadow-lg shadow-sky/20">
              <Plus className="mr-2 h-4 w-4" /> Schedule New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display">Schedule New Class</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new class session.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClass} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input id="name" placeholder="e.g. Advanced Physics" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Input id="teacher" placeholder="Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select defaultValue="online">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time Slot</Label>
                <Input id="time" placeholder="e.g. 10:00 AM - 11:30 AM" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource">Meeting Link / Room No.</Label>
                <Input id="resource" placeholder="URL or Room Number" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-sky">Create Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classes..." 
            className="pl-9 bg-muted/50 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cls) => (
          <Card key={cls.id} className="group hover:shadow-xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm overflow-hidden border-t-4 border-t-transparent hover:border-t-sky">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant={cls.type === "Online" ? "default" : "secondary"} className={cls.type === "Online" ? "bg-sky text-white" : ""}>
                    {cls.type === "Online" ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                    {cls.type}
                  </Badge>
                  <CardTitle className="text-xl font-display pt-2">{cls.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-8 w-8 hover:bg-sky/10 hover:text-sky">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4 text-sky" />
                {cls.teacher}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4 text-sky" />
                {cls.time}
              </div>
              
              <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-2">
                <Badge className={cls.status === "Ongoing" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-sky/10 text-sky border-sky/20"}>
                  {cls.status}
                </Badge>
                {cls.type === "Online" ? (
                  <Button variant="link" className="text-sky p-0 h-auto font-semibold hover:no-underline" asChild>
                    <a href={cls.link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">{cls.location}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
