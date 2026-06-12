
"use client"

import { 
  LayoutDashboard, 
  CalendarDays, 
  MapPin, 
  Palmtree, 
  Ticket, 
  WalletCards, 
  Users,
  UserCircle2,
  ChevronRight,
  LogOut,
  Briefcase
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
import { USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    title: "Projects",
    url: "/projects",
    icon: Briefcase,
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
  const { currentUser, switchUser, isLoaded } = useCurrentUser()
  
  if (!isLoaded) return null

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
              {items.filter(item => item.roles.includes(currentUser.role)).map((item) => (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 overflow-hidden w-full text-left hover:bg-sidebar-accent p-2 rounded-lg transition-colors">
              <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                <span className="text-accent font-bold text-sm">{currentUser.name.charAt(0)}</span>
              </div>
              {state !== "collapsed" && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold truncate text-foreground">{currentUser.name}</span>
                  <span className="text-[10px] uppercase font-bold text-accent/80 tracking-tighter">{currentUser.role}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] bg-card border-border">
            <DropdownMenuLabel>View As (Simulation)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {USERS.map((u) => (
              <DropdownMenuItem 
                key={u.id} 
                onClick={() => switchUser(u.id)}
                className={cn(
                  "flex flex-col items-start gap-1 py-2 cursor-pointer",
                  u.id === currentUser.id && "bg-accent/10"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <UserCircle2 className="w-4 h-4 text-accent" />
                  <span className="font-bold text-sm">{u.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground ml-6 uppercase">{u.role} &bull; {u.position}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 font-bold">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
