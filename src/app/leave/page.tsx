
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LEAVE_REQUESTS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Palmtree, Plus, Clock, CheckCircle2, XCircle, Calendar, Info, Eye, ShieldAlert, HelpCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"

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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simulated_leave_requests', JSON.stringify(requests))
    }
  }, [requests, mounted])

  // Helper function to calculate duration in days
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  // Unified Leave Stats Logic (Synced with Report)
  const leaveStats = useMemo(() => {
    if (!currentUser || !mounted) return null;
    
    // Prorated calculation as at June (Month 6)
    const currentMonth = 6;
    const proratedEntitlement = Math.round((currentUser.annualLeaveLimit / 12) * currentMonth);
    const cf = currentUser.carriedForward || 0;
    const additional = currentUser.additionalLeave || 0;
    
    const taken = requests
      .filter(r => r.userId === currentUser.id && r.status === 'APPROVED')
      .reduce((total, r) => total + calculateDays(r.startDate, r.endDate), 0);
      
    const totalEntitlement = cf + proratedEntitlement + additional;
    const balance = totalEntitlement - taken;
    
    return {
      totalEntitlement,
      taken,
      balance,
      cf,
      additional,
      proratedEntitlement,
      annualLimit: currentUser.annualLeaveLimit
    };
  }, [currentUser, requests, mounted]);

  if (!isLoaded || !mounted || !currentUser) return null

  const isManagement = currentUser.role === 'ADMIN' || currentUser.role === 'HOD'

  const visibleRequests = isManagement
    ? requests
    : requests.filter(r => r.userId === currentUser.id)

  const handleApproval = (id: string, status: 'APPROVED' | 'REJECTED', userName: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ))

    toast({
      title: status === 'APPROVED' ? "Permohonan Diluluskan" : "Permohonan Ditolak",
      description: `Status permohonan cuti untuk ${userName} telah berjaya dikemaskini kepada ${status}.`,
      variant: status === 'REJECTED' ? "destructive" : "default",
    })
  }

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

      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-indigo-600/10 border-indigo-600/20 shadow-lg cursor-help group transition-all hover:bg-indigo-600/20">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Entitlement</p>
                        <HelpCircle className="w-3 h-3 text-indigo-400 opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="text-3xl font-bold font-headline mt-1">{leaveStats?.totalEntitlement} Days</div>
                      <p className="text-[10px] text-muted-foreground mt-1 italic">Hover for breakdown</p>
                    </div>
                    <Palmtree className="text-indigo-500 w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border p-4 shadow-2xl min-w-[200px]">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border-b border-border pb-1">Detailed Breakdown</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-muted-foreground">CF Leave (A):</span>
                  <span className="text-right font-bold">{leaveStats?.cf} Days</span>
                  
                  <span className="text-muted-foreground">Addl Leave:</span>
                  <span className="text-right font-bold">{leaveStats?.additional} Days</span>
                  
                  <span className="text-muted-foreground">Prorated (Jun):</span>
                  <span className="text-right font-bold">{leaveStats?.proratedEntitlement} Days</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-bold text-indigo-400">
                  <span>Total (A + Prorated + Addl)</span>
                  <span>{leaveStats?.totalEntitlement} Days</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
          
          <Card className="bg-emerald-600/10 border-emerald-600/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Taken (Approved)</p>
                  <div className="text-3xl font-bold font-headline mt-1">{leaveStats?.taken} Days</div>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Utilized Balance as at 06/2026</p>
                </div>
                <CheckCircle2 className="text-emerald-500 w-8 h-8 opacity-40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-600/10 border-amber-600/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Remaining Balance</p>
                  <div className="text-3xl font-bold font-headline mt-1">{leaveStats?.balance} Days</div>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Available as at June 2026</p>
                </div>
                <Clock className="text-amber-500 w-8 h-8 opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-border py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-headline">
              {isManagement ? "Leave Request Log" : "My Leave History"}
            </CardTitle>
            <CardDescription>
              {isManagement ? "Track and manage staff leave applications." : "Track your personal leave applications."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-center">Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Docs & Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRequests.map((leave) => {
                const user = USERS.find(u => u.id === leave.userId)
                const totalDays = calculateDays(leave.startDate, leave.endDate)
                
                const canCurrentApproveThis = (currentUser.role === 'ADMIN' && currentUser.id !== user?.id) || 
                                             (currentUser.role === 'HOD' && user?.role === 'STAFF');

                return (
                  <TableRow key={leave.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {user?.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{user?.name}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{user?.role}</span>
                          </div>
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
                    <TableCell className="text-center">
                      <span className="text-xs font-bold text-foreground">{totalDays}</span>
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
                      <div className="flex justify-end items-center gap-2">
                        {leave.mcUrl && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-accent hover:bg-accent/10" title="View MC">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-card border-border">
                              <DialogHeader>
                                <DialogTitle className="font-headline text-sm">Salinan Sijil Sakit (MC)</DialogTitle>
                              </DialogHeader>
                              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border mt-4">
                                <Image src={leave.mcUrl} alt="MC Document" fill className="object-contain" />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {leave.status === 'PENDING' && (
                          <div className="flex gap-1">
                             {canCurrentApproveThis ? (
                               <>
                                 <Button 
                                   onClick={() => handleApproval(leave.id, 'APPROVED', user?.name || '')} 
                                   variant="ghost" 
                                   size="icon" 
                                   className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10"
                                   title="Approve"
                                 >
                                   <CheckCircle2 className="w-4 h-4" />
                                 </Button>
                                 <Button 
                                   onClick={() => handleApproval(leave.id, 'REJECTED', user?.name || '')} 
                                   variant="ghost" 
                                   size="icon" 
                                   className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                                   title="Reject"
                                 >
                                   <XCircle className="w-4 h-4" />
                                 </Button>
                               </>
                             ) : currentUser.id !== user?.id && isManagement ? (
                               <div className="h-7 px-2 flex items-center gap-1.5 rounded bg-secondary/50 border border-border">
                                 <ShieldAlert className="w-3 h-3 text-muted-foreground" />
                                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Review Restricted</span>
                               </div>
                             ) : null}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {visibleRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">
                    Tiada rekod permohonan cuti ditemui.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-4">
        <Info className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-accent">Hierarchy Policy Reminder</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Hanya <span className="text-foreground font-bold">Admin (CEO/HR)</span> yang boleh meluluskan cuti untuk semua staf dan HOD. <span className="text-foreground font-bold">HOD</span> hanya dibenarkan meluluskan cuti untuk pengguna bertaraf Staff sahaja.
          </p>
        </div>
      </div>
    </div>
  )
}
