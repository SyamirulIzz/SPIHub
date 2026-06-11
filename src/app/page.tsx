
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { USERS, PROJECTS, TICKETS, CLAIMS, MOVEMENTS, LEAVE_REQUESTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { 
  Users, 
  Briefcase, 
  TicketIcon, 
  WalletIcon, 
  CalendarCheck2, 
  TrendingUp,
  MapPin
} from "lucide-react"

export default function Dashboard() {
  const { currentUser, isLoaded } = useCurrentUser()
  const [syncedClaims, setSyncedClaims] = useState(CLAIMS)
  const [syncedLeaves, setSyncedLeaves] = useState(LEAVE_REQUESTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedClaims = localStorage.getItem('simulated_claims')
    const savedLeaves = localStorage.getItem('simulated_leave_requests')
    if (savedClaims) setSyncedClaims(JSON.parse(savedClaims))
    if (savedLeaves) setSyncedLeaves(JSON.parse(savedLeaves))
  }, [])
  
  if (!isLoaded || !mounted) return null

  const pendingClaims = syncedClaims.filter(c => c.status === 'PENDING').length
  const openTickets = TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length
  const activeProjects = PROJECTS.filter(p => p.status === 'ACTIVE').length
  const staffOnSite = MOVEMENTS.filter(m => m.status === 'PENDING' || m.status === 'COMPLETED').length

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Operational Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, <span className="text-accent font-semibold">{currentUser.name}</span>. Perubahan status cuti/tuntutan disegerakkan secara real-time.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl border border-border">
          <TrendingUp className="text-accent w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Company KPI</span>
            <span className="text-sm font-bold text-foreground">98.2% Efficiency</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Projects" 
          value={activeProjects.toString()} 
          icon={Briefcase} 
          description="Across all departments" 
          color="indigo" 
        />
        <StatCard 
          title="Open Tickets" 
          value={openTickets.toString()} 
          icon={TicketIcon} 
          description="Requiring attention" 
          color="cyan" 
        />
        <StatCard 
          title="Pending Claims" 
          value={pendingClaims.toString()} 
          icon={WalletIcon} 
          description="Waiting for approval" 
          color="amber" 
        />
        <StatCard 
          title="Staff On-Site" 
          value={staffOnSite.toString()} 
          icon={MapPin} 
          description="Current client visits" 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <CalendarCheck2 className="text-primary w-5 h-5" />
              Recent Staff Movements
            </CardTitle>
            <CardDescription>Latest out-of-office activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOVEMENTS.map((mov) => {
                const user = USERS.find(u => u.id === mov.userId)
                const project = PROJECTS.find(p => p.id === mov.projectId)
                return (
                  <div key={mov.id} className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all cursor-default group">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{project?.name} &bull; {mov.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-accent/80 uppercase tracking-tighter">{mov.category.replace('_', ' ')}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(mov.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Users className="text-accent w-5 h-5" />
              Department Load
            </CardTitle>
            <CardDescription>Personnel distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Engineering</span>
                  <span className="font-bold">12 Staff</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Operations</span>
                  <span className="font-bold">5 Staff</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Management</span>
                  <span className="font-bold">3 Staff</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent">Internal Memo</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                All staff are reminded to submit medical claims before the 25th of each month for payroll processing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, description, color }: any) {
  const colorMap: any = {
    indigo: "text-primary bg-primary/10 border-primary/20",
    cyan: "text-accent bg-accent/10 border-accent/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  }

  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden relative group">
      <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 bg-current transition-all group-hover:opacity-40", colorMap[color]?.split(' ')[0])}></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg border", colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline text-foreground">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
