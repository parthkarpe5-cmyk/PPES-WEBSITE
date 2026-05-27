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
import { getMediaUrl, getMyProfile, getStoredUserData } from '@/lib/api'

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/student",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      url: "/student/courses",
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
      title: "Timetable",
      url: "/student/timetable",
      icon: Calendar,
    },
  ],
}

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = React.useState(getStoredUserData())

  React.useEffect(() => {
    const refreshUser = async () => {
      const storedUser = getStoredUserData()

      if (storedUser?.id && !storedUser.image) {
        try {
          const latestProfile = await getMyProfile()
          setUser({
            ...storedUser,
            ...latestProfile,
            image: getMediaUrl(latestProfile?.image || storedUser.image)
          })
          return
        } catch {
          // Fall back to the stored cookie data if the profile fetch fails.
        }
      }

      setUser(storedUser)
    }

    refreshUser()
    window.addEventListener('user-data-updated', refreshUser)

    return () => window.removeEventListener('user-data-updated', refreshUser)
  }, [])

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login/student');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
              <Link href="/student">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2FA8CC] to-[#1F4E79] text-white shadow-lg">
                  <School className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg font-display tracking-tight text-sidebar-foreground">PPES</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#2FA8CC] font-bold">Student Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/30 text-[10px] uppercase tracking-widest px-4 font-bold">Learning</SidebarGroupLabel>
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
                      ? 'bg-sidebar-accent text-sidebar-foreground border-l-2 border-[#2FA8CC]'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'}
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className={`size-5 ${pathname === item.url ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60'}`} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full hover:bg-white/5 transition-colors rounded-xl p-2"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={getMediaUrl(user?.image) || ''} alt={user?.name || 'Student'} />
                    <AvatarFallback className="bg-[#2FA8CC] text-white">
                      {(user?.name || 'Student')
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-sidebar-foreground">{user?.name || 'Student'}</span>
                    <span className="truncate text-xs text-sidebar-foreground/40">{user?.grade || 'Student Profile'}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-sidebar-foreground/20" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56  backdrop-blur-xl border-border text-foreground rounded-xl"
                side="top"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer rounded-lg m-1">
                  <Link href="/student/profile" className="flex items-center">
                    <User className="mr-2 size-4 text-[#2FA8CC]" />
                    Profile
                  </Link>
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
