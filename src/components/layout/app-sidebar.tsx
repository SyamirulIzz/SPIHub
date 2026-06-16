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
  Briefcase,
  BarChart3,
  Banknote,
  Package
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
    title: "Executive Reports",
    url: "/admin/reports",
    icon: BarChart3,
    roles: ['ADMIN']
  },
  {
    title: "Payroll Management",
    url: "/admin/payroll",
    icon: Banknote,
    roles: ['ADMIN']
  },
  {
    title: "Asset Management",
    url: "/assets",
    icon: Package,
    roles: ['ADMIN', 'HOD', 'STAFF']
  },
  {
    title: "Shared Calendar",
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

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state, setOpenMobile } = useSidebar()
  const { currentUser, switchUser, logout, isLoaded } = useCurrentUser()
  
  if (!isLoaded || !currentUser) return null

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-sidebar-border shadow-2xl print:hidden", className)}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-border overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 50C30 35 45 25 60 25C75 25 85 35 85 50C85 65 70 75 50 75C30 75 15 60 15 45C15 30 30 20 45 20" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="28" cy="55" r="5" fill="#EF4444" />
              <circle cx="65" cy="30" r="5" fill="#EF4444" />
            </svg>
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg font-headline tracking-tight text-foreground leading-tight">SPI HUB</span>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none mt-0.5">System Protocol Information</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            Main Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.filter(item => item.roles.includes(currentUser.role)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url} 
                    tooltip={item.title} 
                    className="group py-6 px-4 transition-all hover:bg-sidebar-accent/50 data-[active=true]:bg-primary/10"
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        pathname === item.url ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className={cn(
                        "font-semibold text-sm",
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
            <button className="flex items-center gap-3 overflow-hidden w-full text-left hover:bg-sidebar-accent p-2 rounded-lg transition-colors group">
              <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30 group-hover:border-accent transition-colors">
                <span className="text-accent font-bold text-sm">{currentUser.name.charAt(0)}</span>
              </div>
              {state !== "collapsed" && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold truncate text-foreground leading-none">{currentUser.name}</span>
                  <span className="text-[9px] uppercase font-bold text-accent/80 tracking-tighter mt-1">{currentUser.role} &bull; {currentUser.position.split(' ')[0]}</span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[260px] bg-card border-border shadow-2xl">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Profile (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
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
                  <span className="text-[9px] text-muted-foreground ml-6 uppercase">{u.role} &bull; {u.position}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive font-bold cursor-pointer hover:bg-destructive/10">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar Sistem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
