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
  User,
  LogOut,
  ChevronRight,
  School,
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
      url: "/faculty",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      url: "/faculty/courses",
      icon: BookOpen,
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
    router.push('/login/faculty');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
              <Link href="/faculty">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#2FA8CC] text-white shadow-lg">
                  <School className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg font-display tracking-tight text-sidebar-foreground">PPES</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#2FA8CC] font-bold">Faculty Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest px-4 font-bold">Main Navigation</SidebarGroupLabel>
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
      <SidebarFooter className="border-t border-sidebar-border p-4 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full hover:bg-white/5 transition-colors rounded-xl p-2"
                >
                  <Avatar className="h-8 w-8 border border-border shadow-lg">
                    <AvatarImage src={getMediaUrl(user?.image) || '/avatars/faculty.png'} alt={user?.name || 'Faculty'} />
                    <AvatarFallback className="bg-[#1F4E79] text-white">
                      {(user?.name || 'Faculty')
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'FC'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold text-sidebar-foreground">{user?.name || 'Faculty'}</span>
                    <span className="truncate text-xs text-sidebar-foreground/40">{user?.grade || 'Faculty Profile'}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-sidebar-foreground/20" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-slate-900/90 backdrop-blur-xl border-border text-foreground rounded-xl"
                side="top"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer rounded-lg m-1 transition-colors">
                  <Link href="/faculty/profile" className="flex items-center">
                    <User className="mr-2 size-4 text-[#2FA8CC]" />
                    Profile
                  </Link>
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
