import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { Search, Bell, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset className="bg-[#050B14] text-white">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/5 px-6 backdrop-blur-md bg-transparent sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <SidebarTrigger className="-ml-1 text-white/40 hover:text-white" />
             <div className="h-6 w-px bg-white/5 hidden sm:block" />
             <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#FF6B00]/20 to-transparent rounded-full border border-[#FF6B00]/20 hidden md:flex">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
                </span>
                <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider">Physics Live Class in Session</span>
             </div>
          </div>
          
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <Input
                type="search"
                placeholder="Search lessons, tests..."
                className="pl-9 bg-white/[0.03] border-white/10 text-white rounded-full h-9 text-xs focus:ring-[#2FA8CC] transition-all focus:bg-white/[0.07]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/5 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-[#2FA8CC] rounded-full border border-[#050B14]" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-[#2FA8CC]/10 flex items-center justify-center border border-[#2FA8CC]/20 cursor-pointer hover:bg-[#2FA8CC]/20 transition-all">
              <Sparkles className="h-4 w-4 text-[#2FA8CC]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
