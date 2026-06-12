
"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TICKETS, PROJECTS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { 
  ArrowLeft, 
  Ticket, 
  User, 
  Calendar, 
  ShieldAlert, 
  Activity, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoaded } = useCurrentUser()
  const [ticketList, setTicketList] = useState(TICKETS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTickets = localStorage.getItem('simulated_tickets')
    if (savedTickets) {
      setTicketList(JSON.parse(savedTickets))
    }
  }, [])
  
  if (!isLoaded || !mounted) return null

  const ticket = ticketList.find(t => t.id === id)
  
  if (!ticket) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold font-headline">Ticket Not Found</h2>
        <Button onClick={() => router.push("/tickets")}>Back to Tickets</Button>
      </div>
    )
  }

  const project = PROJECTS.find(p => p.id === ticket.projectId)
  const creator = USERS.find(u => u.id === ticket.createdBy)
  const assignee = USERS.find(u => u.id === ticket.assignedTo)

  const mockTimeline = [
    { date: "2024-05-10 11:20", user: creator?.name || 'Unknown', action: "Created ticket", detail: "Initial report submitted." },
    { date: "2024-05-10 14:00", user: "System", action: "Status changed", detail: "Status set to 'In Progress'." },
    { date: assignee ? "2024-05-11 09:30" : "N/A", user: assignee?.name || 'System', action: "Update", detail: assignee ? "Investigating issues." : "Pending assignment." },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/tickets")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Helpdesk
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase">
                {ticket.id}
              </Badge>
              <Badge className={cn(
                "text-[10px] font-bold px-2 py-0.5",
                ticket.severity === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                ticket.severity === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              )}>
                {ticket.severity} SEVERITY
              </Badge>
            </div>
            <h1 className="text-3xl font-bold font-headline text-foreground">{ticket.subject}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border">Edit Ticket</Button>
            <Button className="bg-primary text-white font-bold">Close Ticket</Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="bg-secondary/10 border-b border-border">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Ticket className="w-5 h-5 text-accent" />
                Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="bg-secondary/10 border-b border-border">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {mockTimeline.map((item, index) => (
                  <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
                    {index !== mockTimeline.length - 1 && (
                      <div className="absolute left-2.5 top-6 bottom-0 w-px bg-border"></div>
                    )}
                    <div className="h-5 w-5 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 z-10">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{item.action}</span>
                        <span className="text-[10px] text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-accent">{item.user}</span>: {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">End of History</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Project</label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="w-4 h-4 text-primary" />
                  {project?.name}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                <div className="flex items-center gap-2">
                  {ticket.status === 'Resolved' ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> RESOLVED
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold">
                      <Clock className="w-3 h-3 mr-1" /> {ticket.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Created By</label>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {creator?.name?.charAt(0) || '?'}
                  </div>
                  {creator?.name || 'Unknown'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Assigned To</label>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent border border-accent/30">
                    {assignee?.name?.charAt(0) || 'U'}
                  </div>
                  {assignee?.name || "Unassigned"}
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Created Date</label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
            <h4 className="text-xs font-bold text-accent flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Operational Note
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Semua tindakan yang diambil pada tiket ini direkodkan secara automatik untuk tujuan audit prestasi KPI projek.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
