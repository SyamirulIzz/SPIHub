"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PROJECTS, USERS, TICKETS, MOVEMENTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { 
  ArrowLeft, 
  Briefcase, 
  Edit, 
  Calendar, 
  Activity, 
  MapPin, 
  Ticket,
  Clock,
  CheckCircle2,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [projectList, setProjectList] = useState(PROJECTS)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('simulated_projects')
    if (saved) {
      setProjectList(JSON.parse(saved))
    }
  }, [])

  if (!isLoaded || !mounted) return null

  const project = projectList.find(p => p.id === id)
  
  if (!project) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold font-headline">Project Not Found</h2>
        <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
      </div>
    )
  }

  const isAdmin = currentUser?.role === 'ADMIN'
  
  // Simulated stats for this project
  const projectTickets = TICKETS.filter(t => t.projectId === project.id)
  const projectMovements = MOVEMENTS.filter(m => m.projectId === project.id)

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/projects")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={cn(
                "text-[10px] font-bold px-2 py-0.5 tracking-wider",
                project.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                project.status === 'COMPLETED' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {project.status}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">{project.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">{project.name}</h1>
          </div>
          {isAdmin && (
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Link href={`/projects/${project.id}/edit`}>
                <Edit className="w-4 h-4" />
                Edit Project
              </Link>
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="bg-secondary/10 border-b border-border">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-accent" />
                  Related Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectTickets.length > 0 ? projectTickets.map(ticket => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="flex items-center justify-between p-2 rounded hover:bg-secondary/20 border border-transparent hover:border-border transition-all">
                    <span className="text-xs font-medium truncate pr-2">{ticket.subject}</span>
                    <Badge variant="outline" className="text-[8px] font-bold shrink-0">{ticket.status}</Badge>
                  </Link>
                )) : (
                  <p className="text-xs text-muted-foreground italic">No tickets recorded.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Recent Site Movements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectMovements.length > 0 ? projectMovements.slice(0, 5).map(mov => {
                  const user = USERS.find(u => u.id === mov.userId)
                  return (
                    <div key={mov.id} className="flex items-center justify-between p-2 rounded bg-secondary/10 border border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold">{user?.name}</span>
                        <span className="text-[9px] text-muted-foreground">{mov.destination}</span>
                      </div>
                      <Badge className="text-[8px] bg-emerald-500/10 text-emerald-500 border-none">{mov.status}</Badge>
                    </div>
                  )
                }) : (
                  <p className="text-xs text-muted-foreground italic">No movements logged.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Overview Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Project Lifecycle</label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="w-4 h-4 text-primary" />
                  {project.status === 'ACTIVE' ? 'Ongoing Development' : project.status}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Active Personnel</label>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {new Set(projectMovements.map(m => m.userId)).size} Staff Involved
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Pending Issues</label>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {projectTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length} Open Tickets
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
               <div className="p-3 w-full rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3">
                 <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                 <p className="text-[9px] text-muted-foreground leading-relaxed">
                   Status projek ini memberi kesan kepada kebolehan kakitangan untuk mendaftarkan log pergerakan tapak.
                 </p>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}