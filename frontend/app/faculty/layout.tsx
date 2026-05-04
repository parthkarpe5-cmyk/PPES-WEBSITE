import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { FacultySidebar } from "@/components/faculty/faculty-sidebar"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <FacultySidebar />
      <SidebarInset className="bg-[#050B14] text-white overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/5 px-6 backdrop-blur-md bg-transparent sticky top-0 z-10">
          <SidebarTrigger className="-ml-1 text-white/60 hover:text-white" />
          
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
              <Input
                type="search"
                placeholder="Search students, courses..."
                className="pl-9 bg-white/5 border-white/10 text-white rounded-xl focus:ring-[#2FA8CC] transition-all focus:bg-white/10"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-xs font-semibold text-white">Parth Karpe</span>
              <span className="text-[10px] text-[#2FA8CC] font-bold">FACULTY</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
