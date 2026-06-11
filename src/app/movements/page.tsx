
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MOVEMENTS, PROJECTS, USERS } from "@/lib/mock-data"
import { MapPin, Plus, Truck, Users, Briefcase, ExternalLink, Filter, MoreVertical, Edit2, XCircle, FileText, CheckCircle2, ShieldCheck, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"

export default function MovementsPage() {
  const [mounted, setMounted] = useState(false)
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [movementLogs, setMovementLogs] = useState(MOVEMENTS)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('simulated_movements')
    if (saved) {
      setMovementLogs(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simulated_movements', JSON.stringify(movementLogs))
    }
  }, [movementLogs, mounted])

  if (!isLoaded || !mounted) return null

  const canApproveMovements = currentUser.role === 'ADMIN' || currentUser.role === 'HOD'

  const handleStatusUpdate = (id: string, status: 'APPROVED' | 'CANCELLED' | 'COMPLETED', userName: string) => {
    setMovementLogs(prev => prev.map(mov => 
      mov.id === id ? { ...mov, status, approvedBy: currentUser.name } : mov
    ))

    toast({
      title: "Status Dikemaskini",
      description: `Pergerakan untuk ${userName} telah dikemaskini kepada status ${status}.`,
      variant: status === 'CANCELLED' ? "destructive" : "default",
    })
  }

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-left-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Staff Movement Log</h1>
          <p className="text-muted-foreground mt-1">Track and coordinate field deployments and client meetings.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
          <Link href="/movements/log">
            <Plus className="w-4 h-4" />
            Log New Movement
          </Link>
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
                  <TableHead>Destination</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movementLogs.map((mov) => {
                  const user = USERS.find(u => u.id === mov.userId)
                  const project = PROJECTS.find(p => p.id === mov.projectId)
                  const dateObj = new Date(mov.startDate)
                  
                  return (
                    <TableRow key={mov.id} className="hover:bg-secondary/20 group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-primary">
                            {user?.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="font-semibold">{user?.name}</span>
                             <span className="text-[10px] text-muted-foreground">{project?.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-accent" /> {mov.destination}
                          </span>
                          <span className="text-[10px] text-muted-foreground italic mt-0.5 line-clamp-1">"{mov.purpose}"</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[10px] font-mono">
                          <div>{dateObj.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mov.evidenceUrl ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[10px] font-bold text-accent hover:bg-accent/10">
                                <FileText className="w-3 h-3" /> View Proof
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl bg-card border-border">
                              <DialogHeader>
                                <DialogTitle className="font-headline">Dokumen Bukti Pergerakan</DialogTitle>
                              </DialogHeader>
                              <div className="relative aspect-video rounded-xl overflow-hidden border border-border mt-4">
                                <Image src={mov.evidenceUrl} alt="Movement Proof" fill className="object-cover" />
                              </div>
                              <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border">
                                <p className="text-xs text-muted-foreground">Lokasi: <span className="text-foreground font-bold">{mov.destination}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">Tujuan: <span className="text-foreground font-bold">{mov.purpose}</span></p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">No evidence</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium">
                          {mov.approvedBy ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span className="text-foreground">{mov.approvedBy}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground italic">Not yet approved</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[9px] font-bold tracking-widest px-2 py-0.5",
                          mov.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                          mov.status === 'APPROVED' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          mov.status === 'CANCELLED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {mov.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end gap-1">
                            {canApproveMovements && mov.status === 'PENDING' && (
                              <>
                                <Button 
                                  onClick={() => handleStatusUpdate(mov.id, 'APPROVED', user?.name || '')}
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => handleStatusUpdate(mov.id, 'CANCELLED', user?.name || '')}
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border">
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(mov.id, 'COMPLETED', user?.name || '')} className="text-xs gap-2">
                                    <CheckCircle2 className="w-3 h-3" /> Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Fungsi edit akan datang." })} className="text-xs gap-2">
                                    <Edit2 className="w-3 h-3" /> Edit Movement
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                         </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-secondary/20 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Briefcase className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Deployment Status</p>
                    <p className="text-xl font-bold">{movementLogs.filter(m => m.status === 'APPROVED' || m.status === 'PENDING').length} Active</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
