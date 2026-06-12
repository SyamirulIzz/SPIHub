
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { USERS, CLAIMS, LEAVE_REQUESTS, MOVEMENTS } from "@/lib/mock-data"
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Briefcase, 
  Palmtree, 
  TrendingUp, 
  FileText, 
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
  FileSpreadsheet,
  FileDown,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function AdminReportsPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  
  // Data State
  const [syncedUsers, setSyncedUsers] = useState(USERS)
  const [syncedClaims, setSyncedClaims] = useState(CLAIMS)
  const [syncedLeaves, setSyncedLeaves] = useState(LEAVE_REQUESTS)
  const [syncedMovements, setSyncedMovements] = useState(MOVEMENTS)

  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem('simulated_users')
    const savedClaims = localStorage.getItem('simulated_claims')
    const savedLeaves = localStorage.getItem('simulated_leave_requests')
    const savedMovements = localStorage.getItem('simulated_movements')
    
    if (savedUsers) setSyncedUsers(JSON.parse(savedUsers))
    if (savedClaims) setSyncedClaims(JSON.parse(savedClaims))
    if (savedLeaves) setSyncedLeaves(JSON.parse(savedLeaves))
    if (savedMovements) setSyncedMovements(JSON.parse(savedMovements))
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

    // Prorated entitlement calculation (Example: June is month 6 of 12)
    const currentMonth = 6;
    
    const leaveRecords = syncedUsers.map(user => {
      const taken = syncedLeaves
        .filter(l => l.userId === user.id && l.status === 'APPROVED')
        .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
      
      const cf = user.carriedForward || 0;
      const additional = user.additionalLeave || 0;
      const annualLimit = user.annualLeaveLimit;
      const proratedEntitlement = Math.round((annualLimit / 12) * currentMonth);
      const totalEntitlement = cf + proratedEntitlement;
      const balance = totalEntitlement - taken;
      
      return {
        ...user,
        cf,
        additional,
        proratedEntitlement,
        totalEntitlement,
        taken,
        balance,
        unpaid: user.unpaidLeave || 0
      }
    });

    const totalClaimsApproved = syncedClaims
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.amount, 0);

    const totalMonthlyPayroll = syncedUsers.reduce((sum, u) => sum + (u.salary || 0), 0);

    const categoryExpenses = {
      MEDICAL: syncedClaims.filter(c => c.category === 'MEDICAL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
      TRAVEL: syncedClaims.filter(c => c.category === 'TRAVEL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
      GENERAL: syncedClaims.filter(c => c.category === 'GENERAL' && c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
    };

    return { leaveRecords, totalClaimsApproved, categoryExpenses, totalMonthlyPayroll };
  }, [mounted, syncedUsers, syncedLeaves, syncedClaims]);

  const handleExportPDF = () => {
    toast({
      title: "Menjana Laporan PDF",
      description: "Sila tunggu sebentar sementara kami menyediakan dokumen anda.",
    });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleExportExcel = () => {
    if (!reportsData) return;

    toast({
      title: "Mengeksport ke Excel",
      description: "Data sedang ditukar ke format CSV/Excel.",
    });

    // Generate CSV content
    const headers = ["No", "Name", "CF 2025", "Additional", "Prorated June 2026", "Total Entitlement", "Taken", "Current Balance", "Unpaid Leave"];
    const rows = reportsData.leaveRecords.map((r, i) => [
      i + 1,
      r.name,
      r.cf,
      r.additional,
      r.proratedEntitlement,
      r.totalEntitlement,
      r.taken,
      r.balance,
      r.unpaid
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SPI_Leave_Report_June_2026.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <BarChart3 className="text-primary w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">Executive Dashboard</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">System Protocol Information Sdn Bhd</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border w-48">
              <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                <FileDown className="w-4 h-4 text-red-500" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge className="bg-primary/20 text-primary border-primary/30 h-7 px-3">ADMIN ACCESS</Badge>
          <div className="text-right">
             <p className="text-[10px] text-muted-foreground font-bold uppercase">Report Date</p>
             <p className="text-xs font-bold">09 June 2026</p>
          </div>
        </div>
      </header>

      {/* Top High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:grid-cols-4">
        <StatSummaryCard title="Monthly Payroll" value={`RM ${reportsData?.totalMonthlyPayroll.toLocaleString()}`} icon={Wallet} trend="Basic Salary Outflow" color="text-primary" />
        <StatSummaryCard title="Claims Approved" value={`RM ${reportsData?.totalClaimsApproved.toLocaleString()}`} icon={DollarSign} trend="+4.5% vs Last Month" color="text-emerald-500" />
        <StatSummaryCard title="Staff Count" value={syncedUsers.length.toString()} icon={Users} trend="Active Payroll" color="text-indigo-500" />
        <StatSummaryCard title="Pending Approvals" value={(syncedLeaves.filter(l => l.status === 'PENDING').length + syncedClaims.filter(c => c.status === 'PENDING').length).toString()} icon={Clock} trend="Needs Action" color="text-amber-500" />
      </div>

      <Tabs defaultValue="leave" className="space-y-6">
        <TabsList className="bg-secondary/30 border border-border p-1 h-12 print:hidden">
          <TabsTrigger value="leave" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            <Palmtree className="w-4 h-4" /> LEAVE RECORD
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            <Wallet className="w-4 h-4" /> FINANCIAL ANALYTICS
          </TabsTrigger>
          <TabsTrigger value="ops" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            <Briefcase className="w-4 h-4" /> OPERATIONAL HEALTH
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Official Leave Record */}
        <TabsContent value="leave">
          <Card className="bg-card border-border shadow-2xl overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="bg-secondary/10 border-b border-border text-center py-6">
              <h2 className="text-lg font-bold font-headline uppercase tracking-widest">SYSTEM PROTOCOL INFORMATION SDN BHD</h2>
              <p className="text-md font-bold mt-1">Leave Record</p>
              <p className="text-sm font-bold text-accent uppercase">Jun-2026</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="border-collapse">
                <TableHeader className="bg-secondary/30">
                  <TableRow className="border-y-2 border-border/50">
                    <TableHead className="w-[40px] border-r text-center font-bold text-[10px] text-foreground">No</TableHead>
                    <TableHead className="w-[280px] border-r font-bold text-[10px] text-foreground">Name</TableHead>
                    <TableHead className="border-r text-center font-bold text-[9px] text-foreground leading-tight px-1">Balance Leave <br/>carried from 2025 (A)</TableHead>
                    <TableHead className="border-r text-center font-bold text-[9px] text-foreground leading-tight px-1">Additional <br/>Leave (Raya)</TableHead>
                    <TableHead className="border-r text-center font-bold text-[9px] text-foreground leading-tight px-1">Entitlement Leave <br/>as at JUNE 2026 (Prorated) B</TableHead>
                    <TableHead className="border-r text-center font-bold text-[9px] text-foreground leading-tight px-1 bg-primary/5">Total Leave <br/>entitlement (A+B)</TableHead>
                    <TableHead className="border-r text-center font-bold text-[9px] text-foreground leading-tight px-1">Total Leave <br/>Taken as at 06/2026</TableHead>
                    <TableHead className="border-r text-center font-bold text-[10px] text-foreground leading-tight px-1 bg-accent/5">Balance Leave <br/>as at JUNE 2026</TableHead>
                    <TableHead className="border-r text-center font-bold text-[10px] text-foreground px-1">Unpaid Leave</TableHead>
                    <TableHead className="text-center font-bold text-[10px] text-foreground px-1">Entitlement <br/>Leave per year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData?.leaveRecords.map((record, index) => (
                    <TableRow key={record.id} className="hover:bg-secondary/20 transition-colors border-b border-border/50">
                      <TableCell className="border-r text-center text-[10px] py-2">{index + 1}</TableCell>
                      <TableCell className="border-r font-bold text-[10px] py-2 uppercase tracking-tighter">{record.name}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2 font-medium">{record.cf}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2">{record.additional || ""}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2">{record.proratedEntitlement}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2 font-bold bg-primary/5">{record.totalEntitlement}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2 text-red-500 font-bold">{record.taken}</TableCell>
                      <TableCell className="border-r text-center text-[12px] py-2 font-extrabold text-emerald-500 bg-accent/5">{record.balance}</TableCell>
                      <TableCell className="border-r text-center text-[11px] py-2">{record.unpaid || 0}</TableCell>
                      <TableCell className="text-center text-[11px] py-2 font-bold">{record.annualLeaveLimit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-4 bg-secondary/5 border-t border-border flex justify-between items-center print:hidden">
               <p className="text-[10px] font-bold text-muted-foreground">**Data as at 09/06/2026</p>
               <div className="flex gap-4">
                  <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500">Auto-Calculated</Badge>
                  <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">HR Official Format</Badge>
               </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Financial Analytics */}
        <TabsContent value="finance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
            <Card className="bg-card border-border shadow-lg print:shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" /> Payroll Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Total Monthly Basic Salary</span>
                    <span className="text-primary font-headline text-lg">RM {reportsData?.totalMonthlyPayroll.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="pt-4 space-y-4 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Claim Breakdown</p>
                  <CategoryExpenseRow label="Medical Claims" amount={reportsData?.categoryExpenses.MEDICAL || 0} color="bg-red-500" total={reportsData?.totalClaimsApproved || 1} />
                  <CategoryExpenseRow label="Travel & Fuel" amount={reportsData?.categoryExpenses.TRAVEL || 0} color="bg-blue-500" total={reportsData?.totalClaimsApproved || 1} />
                  <CategoryExpenseRow label="General / Misc" amount={reportsData?.categoryExpenses.GENERAL || 0} color="bg-amber-500" total={reportsData?.totalClaimsApproved || 1} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card border-border shadow-lg overflow-hidden print:shadow-none print:md:col-span-2">
               <CardHeader className="bg-secondary/10 border-b border-border">
                  <CardTitle className="text-sm font-bold">Payroll & Benefit Master List</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/5">
                      <TableRow>
                        <TableHead className="text-[10px]">Staff Name</TableHead>
                        <TableHead className="text-[10px]">Position</TableHead>
                        <TableHead className="text-right text-[10px]">Basic Salary</TableHead>
                        <TableHead className="text-right text-[10px]">Total Claims</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncedUsers.map(user => {
                        const userClaimsTotal = syncedClaims
                          .filter(c => c.userId === user.id && c.status === 'APPROVED')
                          .reduce((sum, c) => sum + c.amount, 0);
                        return (
                          <TableRow key={user.id} className="text-[11px] border-b border-border/30">
                            <TableCell className="font-bold">{user.name}</TableCell>
                            <TableCell className="text-muted-foreground">{user.position}</TableCell>
                            <TableCell className="text-right font-bold text-primary">RM {user.salary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right font-bold text-emerald-500">RM {userClaimsTotal.toFixed(2)}</TableCell>
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
              <Card className="bg-card border-border print:shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" /> Site Deployment Overview
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
                              <span>{count} Assignments ({Math.round(percent)}%)</span>
                            </div>
                            <Progress value={percent} className="h-1.5" />
                          </div>
                        )
                      })}
                   </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border overflow-hidden print:shadow-none">
                <CardHeader className="bg-secondary/10 border-b border-border">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Field Staff
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableBody>
                      {syncedMovements.filter(m => m.status === 'APPROVED' || m.status === 'PENDING').map(mov => {
                        const user = syncedUsers.find(u => u.id === mov.userId)
                        return (
                          <TableRow key={mov.id} className="text-[11px]">
                            <TableCell className="font-bold">{user?.name}</TableCell>
                            <TableCell className="text-muted-foreground">{mov.destination}</TableCell>
                            <TableCell className="text-right"><Badge className="bg-primary/10 text-primary text-[9px]">{mov.status}</Badge></TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatSummaryCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all shadow-lg print:shadow-none print:border">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <div className={cn("text-2xl font-bold font-headline", color)}>{value}</div>
            <p className="text-[9px] text-muted-foreground flex items-center gap-1 font-bold print:hidden">
               {trend}
            </p>
          </div>
          <div className={cn("p-2.5 rounded-xl bg-secondary/50 border border-border shadow-inner print:hidden", color)}>
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
