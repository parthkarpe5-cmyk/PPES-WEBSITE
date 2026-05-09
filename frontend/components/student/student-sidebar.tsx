'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  MessageCircle,
  User,
  LogOut,
  School,
  Settings,
  ChevronRight,
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
      url: "/student",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      url: "/dashboard/student/courses",
      icon: BookOpen,
    },
    {
      title: "Events",
      url: "/student/events",
      icon: Calendar,
    },
    {
      title: "Tests",
      url: "/student/tests",
      icon: FileText,
    },
    {
      title: "Doubts",
      url: "/student/doubts",
      icon: MessageCircle,
    },
    {
      title: "Profile",
      url: "/student/profile",
      icon: User,
    },
    {
      title: "Timetable",
      url: "/dashboard/student/timetable",
      icon: Calendar,
    },
  ],
}

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2FA8CC] to-[#1F4E79] text-white shadow-lg">
                  <School className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg font-display tracking-tight text-white">PPES</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#2FA8CC] font-bold">Student Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1F4E79]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/30 text-[10px] uppercase tracking-widest px-4 font-bold">Learning</SidebarGroupLabel>
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
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src="/avatars/student.png" alt="Student" />
                    <AvatarFallback className="bg-[#2FA8CC] text-white">AS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-white">Aryan Sharma</span>
                    <span className="truncate text-xs text-white/40">Grade 12, Science</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-white/20" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#0A101F]/90 backdrop-blur-xl border-white/10 text-white rounded-xl"
                side="top"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer rounded-lg m-1">
                  <Settings className="mr-2 size-4 text-[#2FA8CC]" />
                  My Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-red-500/10 text-red-400 cursor-pointer rounded-lg m-1"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
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
