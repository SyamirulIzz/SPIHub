
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { USERS, PROJECTS, TICKETS, CLAIMS, MOVEMENTS, LEAVE_REQUESTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"
import { useState, useEffect, useMemo } from "react"
import { 
  Users, 
  Briefcase, 
  TicketIcon, 
  WalletIcon, 
  CalendarCheck2, 
  TrendingUp,
  MapPin,
  Info
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Dashboard() {
  const { currentUser, isLoaded } = useCurrentUser()
  const [syncedClaims, setSyncedClaims] = useState(CLAIMS)
  const [syncedLeaves, setSyncedLeaves] = useState(LEAVE_REQUESTS)
  const [syncedMovements, setSyncedMovements] = useState(MOVEMENTS)
  const [syncedTickets, setSyncedTickets] = useState(TICKETS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedClaims = localStorage.getItem('simulated_claims')
    const savedLeaves = localStorage.getItem('simulated_leave_requests')
    const savedMovements = localStorage.getItem('simulated_movements')
    const savedTickets = localStorage.getItem('simulated_tickets')
    
    if (savedClaims) setSyncedClaims(JSON.parse(savedClaims))
    if (savedLeaves) setSyncedLeaves(JSON.parse(savedLeaves))
    if (savedMovements) setSyncedMovements(JSON.parse(savedMovements))
    if (savedTickets) setSyncedTickets(JSON.parse(savedTickets))
  }, [])

  // Pengiraan KPI Dinamik
  const kpiEfficiency = useMemo(() => {
    if (!mounted) return 0;
    
    // 1. Ticket Efficiency (Resolved/Closed vs Total)
    const totalTickets = syncedTickets.length;
    const resolvedTickets = syncedTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const ticketRate = totalTickets > 0 ? (resolvedTickets / totalTickets) : 1;

    // 2. Movement Efficiency (Completed vs Total)
    const totalMovements = syncedMovements.length;
    const completedMovements = syncedMovements.filter(m => m.status === 'COMPLETED').length;
    const movementRate = totalMovements > 0 ? (completedMovements / totalMovements) : 1;

    // Purata Kecekapan (Diberikan pemberat atau purata mudah)
    const average = ((ticketRate + movementRate) / 2) * 100;
    return Math.round(average * 10) / 10; // 1 decimal place
  }, [syncedTickets, syncedMovements, mounted]);
  
  if (!isLoaded || !mounted) return null

  const pendingClaimsCount = syncedClaims.filter(c => c.status === 'PENDING').length
  const openTicketsCount = syncedTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length
  const activeProjectsCount = PROJECTS.filter(p => p.status === 'ACTIVE').length
  const staffOnSiteCount = syncedMovements.filter(m => m.status === 'APPROVED' || m.status === 'PENDING').length

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Operational Dashboard</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Hi, <span className="text-accent font-semibold">{currentUser.name}</span>. Data dikemaskini secara automatik.
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border max-w-fit cursor-help transition-all hover:bg-secondary/50">
                <TrendingUp className="text-accent w-4 h-4" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                    Company KPI <Info className="w-2.5 h-2.5 opacity-50" />
                  </span>
                  <span className="text-xs font-bold text-foreground">{kpiEfficiency}% Efficiency</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border p-3 max-w-xs">
              <p className="text-[10px] font-bold uppercase text-accent mb-1">Nota Pengiraan:</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Kecekapan dikira berdasarkan nisbah penyelesaian tiket bantuan dan status penyiapan log pergerakan site kakitangan secara real-time.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Projects" value={activeProjectsCount.toString()} icon={Briefcase} color="indigo" />
        <StatCard title="Tickets" value={openTicketsCount.toString()} icon={TicketIcon} color="cyan" />
        <StatCard title="Claims" value={pendingClaimsCount.toString()} icon={WalletIcon} color="amber" />
        <StatCard title="On-Site" value={staffOnSiteCount.toString()} icon={MapPin} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <CalendarCheck2 className="text-primary w-5 h-5" />
              Latest Staff Movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {syncedMovements.slice(0, 5).map((mov) => {
                const user = USERS.find(u => u.id === mov.userId)
                return (
                  <div key={mov.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{mov.destination}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] uppercase">{mov.status}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Users className="text-accent w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Leave Utilization</span>
                  <span>65%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Claims Processed</span>
                  <span>RM 12,400</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-[10px] text-muted-foreground italic leading-relaxed">
              "Sila pastikan semua log pergerakan dikemaskini setiap hari sebelum jam 5 petang."
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "text-primary bg-primary/10 border-primary/20",
    cyan: "text-accent bg-accent/10 border-accent/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  }

  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden relative group p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
          <span className="text-xl md:text-2xl font-bold font-headline text-foreground mt-1">{value}</span>
        </div>
        <div className={cn("p-2 rounded-lg border", colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  )
}
