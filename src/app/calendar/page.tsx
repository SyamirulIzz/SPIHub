
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MOVEMENTS, 
  LEAVE_REQUESTS, 
  USERS,
  PROJECTS 
} from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { CalendarDays, Info, Plus, Palmtree, MapPin, Clock, User, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CalendarPage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const [syncedLeaves, setSyncedLeaves] = useState(LEAVE_REQUESTS)
  const [syncedMovements, setSyncedMovements] = useState(MOVEMENTS)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const savedLeaves = localStorage.getItem('simulated_leave_requests')
    if (savedLeaves) {
      setSyncedLeaves(JSON.parse(savedLeaves))
    }
    const savedMovements = localStorage.getItem('simulated_movements')
    if (savedMovements) {
      setSyncedMovements(JSON.parse(savedMovements))
    }
  }, [])

  // Optimasasi: Group data by date to avoid filtering in the 31-day loop
  const groupedData = useMemo(() => {
    const data: Record<string, { movements: typeof MOVEMENTS, leaves: typeof LEAVE_REQUESTS }> = {}
    
    // Initialize 31 days of May 2024
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2024-05-${i.toString().padStart(2, '0')}`
      data[dateStr] = { movements: [], leaves: [] }
    }

    syncedMovements.forEach(m => {
      const date = m.startDate.split('T')[0]
      if (data[date]) data[date].movements.push(m)
    })

    syncedLeaves.forEach(l => {
      const date = l.startDate
      if (data[date] && l.status === 'APPROVED') data[date].leaves.push(l)
    })

    return data
  }, [syncedMovements, syncedLeaves])

  if (!isLoaded || !mounted) return null

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Shared Team Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time availability and movement coordination for all personnel.</p>
        </div>
      </header>

      <TooltipProvider delayDuration={300}>
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-card border-border shadow-2xl overflow-hidden">
            <CardHeader className="bg-secondary/20 border-b border-border py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-primary w-5 h-5" />
                  <span className="font-headline font-bold text-lg">May 2024</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-500"></div>
                    <span className="text-muted-foreground uppercase">Pending Movement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary"></div>
                    <span className="text-muted-foreground uppercase">Approved Movement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-accent"></div>
                    <span className="text-muted-foreground uppercase">Leave (Approved)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-7 border-b border-border bg-secondary/5">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] font-bold text-muted-foreground/60 border-r border-border last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7">
                  {Object.entries(groupedData).map(([dateStr, dayData], i) => {
                    const dayNum = i + 1;
                    const { movements, leaves } = dayData;

                    return (
                      <div key={dateStr} className="min-h-[100px] md:min-h-[120px] p-1.5 border-r border-b border-border last:border-r-0 hover:bg-secondary/10 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn(
                            "text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full",
                            dayNum === 15 ? "bg-primary text-primary-foreground" : "text-muted-foreground/40 group-hover:text-foreground"
                          )}>{dayNum}</span>
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          {movements.map(mov => {
                            const user = USERS.find(u => u.id === mov.userId);
                            const project = PROJECTS.find(p => p.id === mov.projectId);
                            return (
                              <Dialog key={mov.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                      <div className={cn(
                                        "cursor-pointer text-[8px] md:text-[9px] px-1.5 py-0.5 md:py-1 rounded border-l-2 font-medium truncate transition-colors",
                                        mov.status === 'PENDING' 
                                          ? "bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500/20" 
                                          : "bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30"
                                      )}>
                                        {user?.name}: {mov.destination}
                                        {mov.status === 'PENDING' && " (P)"}
                                      </div>
                                    </DialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-card border-border text-[10px]">
                                    <p className="font-bold">{user?.name}</p>
                                    <p className="text-muted-foreground">{mov.destination}</p>
                                    <p className={cn("mt-1 font-bold", mov.status === 'PENDING' ? "text-amber-500" : "text-primary")}>Status: {mov.status}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <DialogContent className="bg-card border-border sm:max-w-[400px]">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 font-headline">
                                      <MapPin className="w-5 h-5 text-primary" />
                                      Movement Details
                                    </DialogTitle>
                                    <DialogDescription>Butiran pergerakan staf ke tapak projek.</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Staff Name</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                          <User className="w-3.5 h-3.5 text-primary" /> {user?.name}
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Project</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                          <Briefcase className="w-3.5 h-3.5 text-primary" /> {project?.name}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Destination</p>
                                        <p className="text-sm font-semibold">{mov.destination}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                                        <Badge className={cn(
                                          "text-[9px] font-bold px-2 py-0.5",
                                          mov.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary"
                                        )}>
                                          {mov.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Purpose</p>
                                      <p className="text-sm text-muted-foreground italic">"{mov.purpose}"</p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {new Date(mov.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )
                          })}

                          {leaves.map(leave => {
                            const user = USERS.find(u => u.id === leave.userId);
                            const isSelf = user?.id === currentUser.id;
                            const canSeeDetail = currentUser.role !== 'STAFF' || isSelf;

                            return (
                              <Dialog key={leave.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                      <div className="cursor-pointer text-[8px] md:text-[9px] px-1.5 py-0.5 md:py-1 rounded bg-accent/20 border-l-2 border-accent text-accent-foreground font-medium truncate hover:bg-accent/30 transition-colors">
                                        {user?.name}: {canSeeDetail ? leave.leaveType : 'On Leave'}
                                      </div>
                                    </DialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-card border-border text-[10px]">
                                    <p className="font-bold">{user?.name}</p>
                                    <p className="text-muted-foreground">{canSeeDetail ? leave.leaveType : 'On Leave'}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <DialogContent className="bg-card border-border sm:max-w-[400px]">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 font-headline">
                                      <Palmtree className="w-5 h-5 text-accent" />
                                      Leave Details
                                    </DialogTitle>
                                    <DialogDescription>Butiran cuti yang telah diluluskan.</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                                        {user?.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold">{user?.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{user?.position}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Leave Type</p>
                                        <p className="text-sm font-semibold">{canSeeDetail ? leave.leaveType : 'PRIVATE'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Duration</p>
                                        <p className="text-xs">{leave.startDate} → {leave.endDate}</p>
                                      </div>
                                    </div>
                                    {canSeeDetail && leave.reason && (
                                      <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Reason</p>
                                        <p className="text-xs text-muted-foreground italic">{leave.reason}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 md:pb-0">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent" />
                  Calendar Legend & Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground space-y-2">
                <p>• <span className="text-foreground font-semibold">Privacy Filter:</span> Standard staff only see "[Name] - On Leave". Detailed categories (AL, MC, EL) are restricted to HODs and Management.</p>
                <p>• <span className="text-foreground font-semibold">Real-time Sync:</span> Kalendar ini disegerakkan secara automatik dengan modul Pengurusan Cuti dan Pergerakan.</p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold h-auto py-6 rounded-xl shadow-lg transition-all gap-2 text-base md:text-lg">
                 <Link href="/movements/log">
                   <Plus className="w-5 h-5" /> Log Movement
                 </Link>
               </Button>
               <Button asChild variant="secondary" className="border border-border text-foreground font-bold h-auto py-6 rounded-xl shadow-lg transition-all gap-2 text-base md:text-lg">
                 <Link href="/leave/apply">
                   <Palmtree className="w-5 h-5" /> Apply Leave
                 </Link>
               </Button>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
