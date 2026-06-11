
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TICKETS, PROJECTS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Ticket, Search, Plus, Sparkles, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import { summarizeProjectTickets, ProjectTicketSummaryOutput } from "@/ai/flows/summarize-project-tickets"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function TicketsPage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState<ProjectTicketSummaryOutput | null>(null)

  if (!isLoaded) return null

  const handleSummarize = async () => {
    setIsSummarizing(true)
    try {
      const ticketsInput = TICKETS.map(t => ({
        ticketId: t.id,
        subject: t.subject,
        description: t.description,
        severity: t.severity,
        status: t.status,
        assignedTo: USERS.find(u => u.id === t.assignedTo)?.name || 'Unassigned',
        discussions: ["Issue acknowledged", "Working on server logs"]
      }))

      const result = await summarizeProjectTickets({
        projectName: PROJECTS[0].name,
        tickets: ticketsInput
      })
      setSummary(result)
    } catch (error) {
      console.error("AI Summary failed", error)
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Project Helpdesk</h1>
          <p className="text-muted-foreground mt-1">Manage technical issues and support tickets.</p>
        </div>
        <div className="flex items-center gap-3">
          {(currentUser.role === 'ADMIN' || currentUser.role === 'HOD') && (
            <Button 
              onClick={handleSummarize} 
              disabled={isSummarizing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isSummarizing ? "Analyzing Issues..." : "AI Executive Summary"}
            </Button>
          )}
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold gap-2">
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </header>

      {summary && (
        <Card className="bg-indigo-950/20 border-indigo-500/30 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="border-b border-indigo-500/20 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-indigo-400 flex items-center gap-2 font-headline">
                <Sparkles className="w-5 h-5" />
                AI Generated Operational Insight
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSummary(null)} className="text-muted-foreground">Dismiss</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Executive Overview</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{summary.executiveSummary}</p>
                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <span className="text-xs font-bold text-indigo-300 uppercase block mb-1">Status Assessment</span>
                  <p className="text-sm font-medium">{summary.overallProjectStatus}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-2">Key Critical Issues</h4>
                  <ul className="space-y-2">
                    {summary.keyIssues.map((issue, i) => (
                      <li key={i} className="text-xs flex items-center gap-2 text-foreground/80">
                        <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-2">Emerging Trends</h4>
                  <ul className="space-y-2">
                    {summary.emergingTrends.map((trend, i) => (
                      <li key={i} className="text-xs flex items-center gap-2 text-foreground/80">
                        <Clock className="w-3 h-3 text-cyan-500 shrink-0" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input className="pl-10 bg-secondary/50 border-border" placeholder="Search tickets..." />
          </div>
          
          <Card className="bg-card border-border">
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-xs font-bold uppercase tracking-wider">Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {PROJECTS.map(p => (
                <div key={p.id} className="p-3 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors cursor-pointer flex justify-between items-center group">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{p.name}</span>
                  <Badge variant="secondary" className="text-[10px] h-4">Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-headline">Recent Tickets</h3>
            <div className="flex gap-2">
               <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Severity</Badge>
               <Badge variant="outline">In Progress</Badge>
            </div>
          </div>

          <div className="space-y-3">
            {TICKETS.map(ticket => {
              const assigned = USERS.find(u => u.id === ticket.assignedTo)
              return (
                <Card key={ticket.id} className="bg-card border-border hover:border-primary/50 transition-all group">
                  <CardContent className="p-5 flex items-start gap-5">
                    <div className={cn(
                      "h-10 w-10 rounded-xl shrink-0 flex items-center justify-center border",
                      ticket.severity === 'High' ? "bg-red-500/10 border-red-500/20 text-red-500" : 
                      ticket.severity === 'Medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    )}>
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-foreground truncate group-hover:text-accent transition-colors">{ticket.subject}</h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                              {assigned?.name.charAt(0)}
                            </div>
                            <span className="text-[10px] text-muted-foreground">Assigned: <span className="text-foreground font-semibold">{assigned?.name}</span></span>
                         </div>
                         <div className="flex items-center gap-1 text-[10px]">
                            {ticket.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-amber-500" />}
                            <span className="text-muted-foreground">{ticket.status}</span>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
