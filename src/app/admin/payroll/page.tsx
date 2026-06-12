
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrentUser } from "@/hooks/use-current-user"
import { USERS, DEPARTMENTS } from "@/lib/mock-data"
import { 
  Banknote, 
  Download, 
  Users, 
  Wallet, 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck,
  CreditCard,
  FileSpreadsheet
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function PayrollManagementPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [staffList, setStaffList] = useState(USERS)

  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem('simulated_users')
    if (savedUsers) {
      setStaffList(JSON.parse(savedUsers))
    }
  }, [])

  useEffect(() => {
    if (isLoaded && currentUser?.role !== 'ADMIN') {
      router.push("/")
    }
  }, [isLoaded, currentUser, router])

  // Pengiraan Penggajian (Malaysian Statutory Rates)
  const payrollData = useMemo(() => {
    return staffList.map(user => {
      const basic = user.salary || 0;
      
      // Potongan Pekerja
      const epfStaff = basic * 0.11;
      const socsoStaff = basic > 0 ? (basic <= 5000 ? basic * 0.005 : 24.75) : 0; // Approx
      const eisStaff = basic > 0 ? (basic <= 5000 ? basic * 0.002 : 9.90) : 0; // Approx
      const pcb = basic > 5000 ? (basic - 5000) * 0.15 : 0; // Simple estimation for demo
      
      const totalDeductions = epfStaff + socsoStaff + eisStaff + pcb;
      const netSalary = basic - totalDeductions;
      
      // Caruman Majikan
      const epfEmployer = basic > 5000 ? basic * 0.12 : basic * 0.13;
      const socsoEmployer = basic > 0 ? (basic <= 5000 ? basic * 0.0175 : 86.65) : 0;
      
      const employerCost = basic + epfEmployer + socsoEmployer;

      return {
        ...user,
        basic,
        epfStaff,
        socsoStaff,
        eisStaff,
        pcb,
        netSalary,
        epfEmployer,
        socsoEmployer,
        employerCost
      }
    });
  }, [staffList]);

  const totals = useMemo(() => {
    return payrollData.reduce((acc, curr) => ({
      basic: acc.basic + curr.basic,
      net: acc.net + curr.netSalary,
      employerCost: acc.employerCost + curr.employerCost,
      deductions: acc.deductions + (curr.basic - curr.netSalary)
    }), { basic: 0, net: 0, employerCost: 0, deductions: 0 });
  }, [payrollData]);

  const handleExportPayroll = () => {
    toast({
      title: "Mengeksport Payroll",
      description: "Fail CSV sedang dijana untuk bulan Jun 2026.",
    });

    const headers = ["Name", "Position", "Basic Salary (RM)", "EPF Staff (11%)", "SOCSO Staff", "EIS Staff", "PCB Tax", "Net Salary (RM)", "EPF Employer", "Total Employer Cost"];
    const rows = payrollData.map(p => [
      p.name,
      p.position,
      p.basic.toFixed(2),
      p.epfStaff.toFixed(2),
      p.socsoStaff.toFixed(2),
      p.eisStaff.toFixed(2),
      p.pcb.toFixed(2),
      p.netSalary.toFixed(2),
      p.epfEmployer.toFixed(2),
      p.employerCost.toFixed(2)
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SPI_Payroll_June_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Banknote className="text-emerald-500 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">Payroll Management</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Jun 2026 Process Cycle</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleExportPayroll}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Master List
          </Button>
          <Badge className="bg-primary/20 text-primary border-primary/30 h-7 px-3">ADMIN ACCESS</Badge>
        </div>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Gross Salary" value={`RM ${totals.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={Wallet} color="text-primary" />
        <StatCard title="Statutory Deductions" value={`RM ${totals.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={CreditCard} color="text-amber-500" />
        <StatCard title="Net Payout (Staff)" value={`RM ${totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={Banknote} color="text-emerald-500" />
        <StatCard title="Total Employer Cost" value={`RM ${totals.employerCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={TrendingUp} color="text-indigo-500" />
      </div>

      <Card className="bg-card border-border shadow-2xl overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
              Payroll Master List - June 2026
            </CardTitle>
            <CardDescription>Pecahan caruman berkanun dan gaji bersih kakitangan.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-right mr-4">
                <p className="text-[10px] text-muted-foreground font-bold">PAYMENT DATE</p>
                <p className="text-xs font-bold">25 June 2026</p>
             </div>
             <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">READY TO PROCESS</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="w-[200px] text-[10px] font-bold uppercase">Staff Name</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase">Basic (RM)</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400">EPF 11%</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400">SOCSO/EIS</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400">PCB</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase bg-primary/5">Net Payout</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-emerald-400">Employer EPF</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase bg-emerald-500/5">Company Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((p) => (
                  <TableRow key={p.id} className="hover:bg-secondary/20 transition-colors border-b border-border/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs">{p.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80">{p.epfStaff.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80">{(p.socsoStaff + p.eisStaff).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80">{p.pcb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-bold text-xs bg-primary/5 text-primary">RM {p.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-emerald-400/80">{p.epfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-bold text-xs bg-emerald-500/5 text-emerald-500">RM {p.employerCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="p-4 bg-secondary/5 border-t border-border flex justify-between items-center">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">** Figures estimated based on standard Malaysian employment regulations 2024</p>
           <div className="flex gap-2">
              <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500">Auto-Calculated</Badge>
              <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">Confidential</Badge>
           </div>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <div className={cn("text-xl font-bold font-headline", color)}>{value}</div>
          </div>
          <div className={cn("p-2 rounded-lg bg-secondary/50", color)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
