
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LEAVE_REQUESTS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Palmtree, Plus, Clock, CheckCircle2, XCircle, Calendar, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function LeavePage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [requests, setRequests] = useState(LEAVE_REQUESTS)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('simulated_leave_requests')
    if (saved) {
      setRequests(JSON.parse(saved))
    }
  }, [])

  // Simpan ke localStorage setiap kali requests berubah
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simulated_leave_requests', JSON.stringify(requests))
    }
  }, [requests, mounted])

  if (!isLoaded || !mounted) return null

  const canApprove = currentUser.role === 'ADMIN' || currentUser.role === 'HOD'

  const handleApproval = (id: string, status: 'APPROVED' | 'REJECTED', userName: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ))

    toast({
      title: status === 'APPROVED' ? "Permohonan Diluluskan" : "Permohonan Ditolak",
      description: `Status permohonan cuti untuk ${userName} telah berjaya dikemaskini kepada ${status} dan akan diselaraskan ke Kalendar.`,
      variant: status === 'REJECTED' ? "destructive" : "default",
    })
  }

  const takenDays = requests
    .filter(r => r.userId === currentUser.id && r.status === 'APPROVED')
    .length // Simplified calculation for mock

  return (
    <div className="p-8 space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-1">Submit applications and manage team availability.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
          <Link href="/leave/apply">
            <Plus className="w-4 h-4" />
            Apply For Leave
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600/10 border-indigo-600/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Annual Leave</p>
                <div className="text-3xl font-bold font-headline mt-1">{currentUser.annualLeaveLimit} Days</div>
                <p className="text-[10px] text-muted-foreground mt-1 italic">Total Allowance per Year</p>
              </div>
              <Palmtree className="text-indigo-500 w-8 h-8 opacity-40" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-600/10 border-emerald-600/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Taken (Approved)</p>
                <div className="text-3xl font-bold font-headline mt-1">{takenDays} Days</div>
                <p className="text-[10px] text-muted-foreground mt-1 italic">Utilized Balance</p>
              </div>
              <CheckCircle2 className="text-emerald-500 w-8 h-8 opacity-40" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-600/10 border-amber-600/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Remaining</p>
                <div className="text-3xl font-bold font-headline mt-1">{currentUser.annualLeaveLimit - takenDays} Days</div>
                <p className="text-[10px] text-muted-foreground mt-1 italic">Available to apply</p>
              </div>
              <Clock className="text-amber-500 w-8 h-8 opacity-40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-border py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-headline">Leave Request Log</CardTitle>
            <CardDescription>Track and manage staff leave applications.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-secondary/40 border-border text-[10px]">ALL HISTORY</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Approvals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((leave) => {
                const user = USERS.find(u => u.id === leave.userId)
                return (
                  <TableRow key={leave.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {user?.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold">{user?.name}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-bold tracking-widest border-border/50 uppercase">
                        {leave.leaveType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span>{leave.startDate}</span>
                        <span>&rarr;</span>
                        <span>{leave.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs italic text-muted-foreground/80 max-w-[200px] truncate">
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold px-2 py-0.5",
                        leave.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        leave.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canApprove && leave.status === 'PENDING' ? (
                        <div className="flex justify-end gap-1">
                           <Button 
                             onClick={() => handleApproval(leave.id, 'APPROVED', user?.name || '')} 
                             variant="ghost" 
                             size="icon" 
                             className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10"
                             title="Approve Leave"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </Button>
                           <Button 
                             onClick={() => handleApproval(leave.id, 'REJECTED', user?.name || '')} 
                             variant="ghost" 
                             size="icon" 
                             className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                             title="Reject Leave"
                           >
                             <XCircle className="w-4 h-4" />
                           </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-medium italic">
                          {leave.status === 'PENDING' ? 'Read-only (Staff)' : 'Processed'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-4">
        <Info className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-accent">Leave Policy Reminder</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Medical Leave (MC) must be accompanied by a valid digital certificate.
            Only HODs and Management (CEO) are authorized to Approve or Reject applications.
            Semua permohonan yang diluluskan akan dipaparkan secara automatik dalam Kalendar Berpusat.
          </p>
        </div>
      </div>
    </div>
  )
}
