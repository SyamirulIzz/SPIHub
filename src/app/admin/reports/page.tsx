
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentUser } from "@/hooks/use-current-user"
import { USERS, DEPARTMENTS, PROJECTS, TICKETS, CLAIMS, MOVEMENTS, LEAVE_REQUESTS } from "@/lib/mock-data"
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Briefcase, 
  Palmtree, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminReportsPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  
  // Data State
  const [syncedUsers, setSyncedUsers] = useState(USERS)
  const [syncedClaims, setSyncedClaims] = useState(CLAIMS)
  const [syncedLeaves, setSyncedLeaves] = useState(LEAVE_REQUESTS)
  const [syncedMovements, setSyncedMovements] = useState(MOVEMENTS)
  const [syncedTickets, setSyncedTickets] = useState(TICKETS)

  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem('simulated_users')
    const savedClaims = localStorage.getItem('simulated_claims')
    const savedLeaves = localStorage.getItem('simulated_leave_requests')
    const savedMovements = localStorage.getItem('simulated_movements')
    const savedTickets = localStorage.getItem('simulated_tickets')
    
    if (savedUsers) setSyncedUsers(JSON.parse(savedUsers))
    if (savedClaims) setSyncedClaims(JSON.parse(savedClaims))
    if (savedLeaves) setSyncedLeaves(JSON.parse(savedLeaves))
    if (savedMovements) setSyncedMovements(JSON.parse(savedMovements))
    if (savedTickets) setSyncedTickets(JSON.parse(savedTickets))
  }, [])

  useEffect(() => {
    if (isLoaded && currentUser?.role !== 'ADMIN') {
      router.push("/")
    }
  }, [isLoaded, currentUser, router])

  // Helper Pengiraan Cuti
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  // Analitis Laporan
  const reportsData = useMemo(() => {
    if (!mounted) return null;

    // 1. Leave Balance Per User
    const leaveBalances = syncedUsers.map(user => {
      const taken = syncedLeaves
        .filter(l => l.userId === user.id && l.status === 'APPROVED')
        .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
      return {
        ...user,
        taken,
        balance: Math.max(0, user.annualLeaveLimit - taken)
      }
    });

    // 2. Financial Summary
    const totalClaimsApproved = syncedClaims
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.amount, 0);
    const totalClaimsPending = syncedClaims
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const categoryExpenses = {
      MEDICAL: syncedClaims.filter(c => c.category === 'MEDICAL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
      TRAVEL: syncedClaims.filter(c => c.category === 'TRAVEL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
      GENERAL: syncedClaims.filter(c => c.category === 'GENERAL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
    };

    // 3. Operational Performance
    const resolvedTickets = syncedTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const ticketRate = syncedTickets.length > 0 ? (resolvedTickets / syncedTickets.length) * 100 : 0;
    
    const completedMovements = syncedMovements.filter(m => m.status === 'COMPLETED').length;
    const movementRate = syncedMovements.length > 0 ? (completedMovements / syncedMovements.length) * 100 : 0;

    return { leaveBalances, totalClaimsApproved, totalClaimsPending, categoryExpenses, ticketRate, movementRate };
  }, [mounted, syncedUsers, syncedLeaves, syncedClaims, syncedTickets, syncedMovements]);

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground flex items-center gap-3">
            <BarChart3 className="text-primary w-8 h-8" />
            Executive Dashboard & Reports
          </h1>
          <p className="text-muted-foreground mt-1">Laporan strategik untuk pemantauan prestasi dan sumber syarikat.</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/30 p-2 rounded-lg border border-border">
          <Badge className="bg-primary/20 text-primary border-primary/30">CEO Access Only</Badge>
          <span className="text-[10px] text-muted-foreground uppercase font-bold px-2">Confidential</span>
        </div>
      </header>

      {/* Top High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatSummaryCard 
          title="Total Claims (Approved)" 
          value={`RM ${reportsData?.totalClaimsApproved.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+4.5% vs last month"
          color="text-emerald-500"
        />
        <StatSummaryCard 
          title="Avg. Ticket Resolution" 
          value={`${reportsData?.ticketRate.toFixed(1)}%`} 
          icon={CheckCircle2} 
          trend="Operational Efficiency"
          color="text-indigo-500"
        />
        <StatSummaryCard 
          title="Staff Utilization" 
          value={`${reportsData?.movementRate.toFixed(1)}%`} 
          icon={TrendingUp} 
          trend="Site Deployment Rate"
          color="text-cyan-500"
        />
        <StatSummaryCard 
          title="Active Personnel" 
          value={syncedUsers.length.toString()} 
          icon={Users} 
          trend="Total Headcount"
          color="text-amber-500"
        />
      </div>

      <Tabs defaultValue="leave" className="space-y-6">
        <TabsList className="bg-secondary/30 border border-border p-1">
          <TabsTrigger value="leave" className="gap-2 text-xs font-bold">
            <Palmtree className="w-3.5 h-3.5" /> Staff Leave Balance
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-2 text-xs font-bold">
            <Wallet className="w-3.5 h-3.5" /> Financial Analytics
          </TabsTrigger>
          <TabsTrigger value="ops" className="gap-2 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" /> Operational Health
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Staff Leave Balance */}
        <TabsContent value="leave">
          <Card className="bg-card border-border shadow-2xl overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border">
              <CardTitle className="text-lg font-headline">Analisis Baki Cuti Kakitangan</CardTitle>
              <CardDescription>Baki cuti tahunan (Annual Leave) terkumpul untuk tujuan penyelarasan sumber.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-secondary/5">
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-center">Limit (Days)</TableHead>
                    <TableHead className="text-center">Taken</TableHead>
                    <TableHead className="text-center">Balance</TableHead>
                    <TableHead className="w-[200px]">Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData?.leaveBalances.map((user) => {
                    const usagePercent = (user.taken / user.annualLeaveLimit) * 100;
                    return (
                      <TableRow key={user.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-bold text-xs">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground uppercase font-medium">{user.position}</TableCell>
                        <TableCell className="text-center font-bold text-xs">{user.annualLeaveLimit}</TableCell>
                        <TableCell className="text-center text-xs text-red-500 font-bold">{user.taken}</TableCell>
                        <TableCell className="text-center text-xs text-emerald-500 font-extrabold">{user.balance}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-muted-foreground">
                              <span>{Math.round(usagePercent)}% used</span>
                            </div>
                            <Progress value={usagePercent} className="h-1.5" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Financial Analytics */}
        <TabsContent value="claims">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CategoryExpenseRow label="Medical Claims" amount={reportsData?.categoryExpenses.MEDICAL || 0} color="bg-red-500" total={reportsData?.totalClaimsApproved || 1} />
                <CategoryExpenseRow label="Travel & Fuel" amount={reportsData?.categoryExpenses.TRAVEL || 0} color="bg-blue-500" total={reportsData?.totalClaimsApproved || 1} />
                <CategoryExpenseRow label="General / Misc" amount={reportsData?.categoryExpenses.GENERAL || 0} color="bg-amber-500" total={reportsData?.totalClaimsApproved || 1} />
                
                <div className="pt-4 mt-4 border-t border-border">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Liability Exposure</p>
                   <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-xs font-bold text-amber-500">Pending Approval</span>
                      <span className="text-sm font-extrabold">RM {reportsData?.totalClaimsPending.toLocaleString()}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card border-border shadow-lg overflow-hidden">
               <CardHeader className="bg-secondary/10 border-b border-border">
                  <CardTitle className="text-sm font-bold">Recent Approved Reimbursements</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncedClaims.filter(c => c.status === 'APPROVED').slice(0, 8).map(claim => {
                        const user = syncedUsers.find(u => u.id === claim.userId)
                        return (
                          <TableRow key={claim.id} className="text-[11px]">
                            <TableCell className="font-bold">{user?.name}</TableCell>
                            <TableCell><Badge variant="outline" className="text-[9px]">{claim.category}</Badge></TableCell>
                            <TableCell>{claim.date}</TableCell>
                            <TableCell className="text-right font-bold text-emerald-500">RM {claim.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Operational Health */}
        <TabsContent value="ops">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Helpdesk Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/20 border border-border text-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Tickets</p>
                       <p className="text-2xl font-bold mt-1">{syncedTickets.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                       <p className="text-[10px] font-bold text-emerald-500 uppercase">Resolved</p>
                       <p className="text-2xl font-bold mt-1 text-emerald-500">{syncedTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Resolution Rate</span>
                      <span>{reportsData?.ticketRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={reportsData?.ticketRate} className="h-2 bg-indigo-500/10" />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    * KPI Sasaran: 85% resolusi dalam tempoh 7 hari bekerja.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-500" />
                    Site Deployment Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-4">
                      {['SITE_VISIT', 'CLIENT_MEETING', 'LOGISTIC', 'OUTSTATION'].map(cat => {
                        const count = syncedMovements.filter(m => m.category === cat).length;
                        const total = syncedMovements.length || 1;
                        const percent = (count / total) * 100;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span>{cat.replace('_', ' ')}</span>
                              <span>{count} Movements ({Math.round(percent)}%)</span>
                            </div>
                            <Progress value={percent} className="h-1.5" />
                          </div>
                        )
                      })}
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
         <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
         <div>
            <h4 className="text-sm font-bold text-primary">CEO Privacy Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Laporan ini mengandungi data sulit syarikat termasuk butiran kewangan dan kehadiran kakitangan. Akses adalah terhad kepada Pengurusan Tertinggi sahaja untuk tujuan perancangan strategik syarikat.
            </p>
         </div>
      </div>
    </div>
  )
}

function StatSummaryCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <div className={cn("text-2xl font-bold font-headline", color)}>{value}</div>
            <p className="text-[9px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {trend}
            </p>
          </div>
          <div className={cn("p-2 rounded-lg bg-secondary/50 border border-border", color)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryExpenseRow({ label, amount, color, total }: any) {
  const percent = (amount / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-bold">
        <span>{label}</span>
        <span className="text-foreground">RM {amount.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className={cn("h-full transition-all", color)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}
