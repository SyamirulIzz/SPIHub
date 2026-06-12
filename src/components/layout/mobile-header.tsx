"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"

export function MobileHeader() {
  const { currentUser, isLoaded } = useCurrentUser()

  if (!isLoaded) return null

  return (
    <header className="md:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="flex items-center gap-1.5 ml-2">
          <div className="bg-primary h-6 w-6 rounded flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-[10px] font-headline">S</span>
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
