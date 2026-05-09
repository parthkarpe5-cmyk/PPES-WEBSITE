'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  FileText,
  MessageCircle,
  Calendar,
  LogOut,
  ChevronRight,
  School,
  Settings,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/faculty",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      url: "/faculty/courses",
      icon: BookOpen,
    },
    {
      title: "Students",
      url: "/faculty/students",
      icon: Users,
    },
    {
      title: "Live Classes",
      url: "/faculty/live",
      icon: Video,
      isLive: true,
    },
    {
      title: "Tests",
      url: "/faculty/tests",
      icon: FileText,
    },
    {
      title: "Doubts",
      url: "/faculty/doubts",
      icon: MessageCircle,
    },
    {
      title: "Schedule",
      url: "/dashboard/faculty",
      icon: Calendar,
    },
  ],
}

export function FacultySidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction();
    router.push('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#1F4E79] text-white" {...props}>
      <SidebarHeader className="border-b border-white/5 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#2FA8CC] text-white shadow-lg">
                  <School className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg font-display tracking-tight text-white">PPES</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#2FA8CC] font-bold">Faculty Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1F4E79]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-widest px-4 font-bold">Main Navigation</SidebarGroupLabel>
          <SidebarMenu className="px-2 gap-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild 
                  isActive={pathname === item.url}
                  className={`
                    transition-all duration-300 rounded-xl px-3 py-2 h-11
                    ${pathname === item.url 
                      ? 'bg-white/10 text-white border-l-2 border-[#2FA8CC]' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className={`size-5 ${pathname === item.url ? 'text-white' : 'text-white/60'}`} />
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.isLive && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse shadow-[0_0_8px_#FF6B00]" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 p-4 bg-[#1F4E79]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full hover:bg-white/5 transition-colors rounded-xl p-2"
                >
                  <Avatar className="h-8 w-8 border border-white/10 shadow-lg">
                    <AvatarImage src="/avatars/faculty.png" alt="Faculty" />
                    <AvatarFallback className="bg-[#1F4E79] text-white">PK</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-white">Dr. Parth Karpe</span>
                    <span className="truncate text-xs text-white/40">Sr. Faculty</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-white/20" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-slate-900/90 backdrop-blur-xl border-white/10 text-white rounded-xl"
                side="top"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer rounded-lg m-1 transition-colors">
                  <Settings className="mr-2 size-4 text-[#2FA8CC]" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-red-500/10 text-red-400 cursor-pointer rounded-lg m-1 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
