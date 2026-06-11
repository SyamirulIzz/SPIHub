"use client"

import { 
  LayoutDashboard, 
  CalendarDays, 
  MapPin, 
  Palmtree, 
  Ticket, 
  WalletCards, 
  Users,
  Settings,
  ChevronRight
} from "lucide-react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { CURRENT_USER } from "@/lib/mock-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Centralized Calendar",
    url: "/calendar",
    icon: CalendarDays,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Staff Movements",
    url: "/movements",
    icon: MapPin,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Leave Management",
    url: "/leave",
    icon: Palmtree,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Project Tickets",
    url: "/tickets",
    icon: Ticket,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Claims & Receipts",
    url: "/claims",
    icon: WalletCards,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    roles: ['ADMIN']
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-2xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold font-headline">S</span>
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg font-headline tracking-tight text-accent">SPI HUB</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">System Protocol</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.filter(item => item.roles.includes(CURRENT_USER.role)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} className="group py-5 px-4 transition-all hover:bg-sidebar-accent/50">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        pathname === item.url ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className={cn(
                        "font-medium",
                        pathname === item.url ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-background/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
            <span className="text-accent font-bold text-sm">{CURRENT_USER.name.charAt(0)}</span>
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate text-foreground">{CURRENT_USER.name}</span>
              <span className="text-[10px] uppercase font-bold text-accent/80 tracking-tighter">{CURRENT_USER.role}</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}