"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CalendarDays, 
  MapPin, 
  Palmtree, 
  Ticket 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Move",
    url: "/movements",
    icon: MapPin,
  },
  {
    title: "Leave",
    url: "/leave",
    icon: Palmtree,
  },
  {
    title: "Support",
    url: "/tickets",
    icon: Ticket,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur-md flex items-center justify-around px-2 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = pathname === item.url
        return (
          <Link 
            key={item.title} 
            href={item.url}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
              isActive ? "text-accent" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              isActive ? "scale-110" : ""
            )} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {item.title}
            </span>
            {isActive && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
