'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Calendar,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  School,
  Clock,
  CreditCard,
  BarChart3,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: School,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Students",
          url: "/admin/users/students",
        },
        {
          title: "Faculty",
          url: "/admin/users/faculty",
        },
      ],
    },
    {
      title: "Attendance",
      url: "/admin/attendance",
      icon: Calendar,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0B0F1A] text-white" {...props}>
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
                  <span className="text-[10px] uppercase tracking-wider text-[#2FA8CC] font-bold">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#0B0F1A]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-widest px-4 font-bold">Main Navigation</SidebarGroupLabel>
          <SidebarMenu className="px-2 gap-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild className="text-white/60 hover:text-white hover:bg-white/5 transition-all rounded-xl">
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-5" />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 p-4 bg-[#0B0F1A]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/admin.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Parth Karpe</span>
                    <span className="truncate text-xs text-muted-foreground">admin@ppes.edu</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
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
