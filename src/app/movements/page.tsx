"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MOVEMENTS, PROJECTS, USERS } from "@/lib/mock-data"
import { MapPin, Plus, Truck, Users, Briefcase, ExternalLink, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function MovementsPage() {
  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-left-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Staff Movement Log</h1>
          <p className="text-muted-foreground mt-1">Track and coordinate field deployments and client meetings.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
          <Plus className="w-4 h-4" />
          Log New Movement
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border bg-secondary/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-headline">Active Pergerakan</CardTitle>
              <CardDescription>Current and upcoming field assignments.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 text-xs border-border">
              <Filter className="w-3 h-3" /> Filter Logs
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/5">
                  <TableHead>Staff</TableHead>
                  <TableHead>Project / Destination</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Transport</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOVEMENTS.map((mov) => {
                  const user = USERS.find(u => u.id === mov.userId)
                  const project = PROJECTS.find(p => p.id === mov.projectId)
                  return (
                    <TableRow key={mov.id} className="hover:bg-secondary/20 group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-primary">
                            {user?.name.charAt(0)}
                          </div>
                          <span className="font-semibold">{user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-accent uppercase tracking-tighter">{project?.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" /> {mov.destination}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[10px] font-mono">
                          <div>{new Date(mov.startDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{new Date(mov.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] gap-1.5 uppercase font-bold tracking-widest border-border text-muted-foreground group-hover:text-foreground">
                          {mov.transportation === 'CAR' ? <Truck className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                          {mov.transportation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-1 italic">"{mov.purpose}"</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn(
                          "text-[9px] font-bold tracking-widest px-2 py-0.5",
                          mov.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {mov.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-secondary/20 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Briefcase className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Client Meetings</p>
                    <p className="text-xl font-bold">12 Total</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
