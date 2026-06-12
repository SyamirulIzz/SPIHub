
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"

export function MobileHeader({ className }: { className?: string }) {
  const { currentUser, isLoaded } = useCurrentUser()

  if (!isLoaded) return null

  return (
    <header className={cn("md:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 print:hidden", className)}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="flex items-center gap-1.5 ml-2">
          <div className="bg-white h-6 w-6 rounded flex items-center justify-center shrink-0 border border-border">
            <svg viewBox="0 0 100 100" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 50C30 35 45 25 60 25C75 25 85 35 85 50C85 65 70 75 50 75C30 75 15 60 15 45C15 30 30 20 45 20" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round"/>
              <circle cx="28" cy="55" r="6" fill="#EF4444" />
            </svg>
          </div>
          <span className="font-bold text-sm font-headline tracking-tight text-accent">SPI HUB</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] font-bold text-foreground leading-none">{currentUser.name.split(' ')[0]}</span>
          <span className="text-[8px] text-accent font-bold uppercase tracking-tighter">{currentUser.role}</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  )
}
