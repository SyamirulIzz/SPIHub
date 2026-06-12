
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
  FileSpreadsheet,
  FileText,
  Printer,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
        totalDeductions,
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

  const handlePrint = () => {
    window.print();
  };

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
        <StatCard title="Total Gross Salary" value={`RM ${totals.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={Wallet} color="text-primary" />
        <StatCard title="Statutory Deductions" value={`RM ${totals.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={CreditCard} color="text-amber-500" />
        <StatCard title="Net Payout (Staff)" value={`RM ${totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={Banknote} color="text-emerald-500" />
        <StatCard title="Total Employer Cost" value={`RM ${totals.employerCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={TrendingUp} color="text-indigo-500" />
      </div>

      <Card className="bg-card border-border shadow-2xl overflow-hidden print:shadow-none print:border-0">
        <CardHeader className="bg-secondary/20 border-b border-border py-4 flex flex-row items-center justify-between print:hidden">
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
          <div className="overflow-x-auto print:overflow-visible">
            <Table>
              <TableHeader className="bg-secondary/10 print:bg-slate-100">
                <TableRow>
                  <TableHead className="w-[200px] text-[10px] font-bold uppercase print:text-black">Staff Name</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase print:text-black">Basic (RM)</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400 print:text-black">EPF 11%</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400 print:text-black">SOCSO/EIS</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-red-400 print:text-black">PCB</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase bg-primary/5 print:bg-transparent print:text-black">Net Payout</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase text-emerald-400 print:text-black">Employer EPF</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase bg-emerald-500/5 print:bg-transparent print:text-black">Company Cost</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase print:hidden">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((p) => (
                  <TableRow key={p.id} className="hover:bg-secondary/20 transition-colors border-b border-border/50 print:border-black">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase print:text-black">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground print:text-black">{p.position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs print:text-black">{p.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80 print:text-black">{p.epfStaff.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80 print:text-black">{(p.socsoStaff + p.eisStaff).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-red-400/80 print:text-black">{p.pcb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-bold text-xs bg-primary/5 text-primary print:bg-transparent print:text-black">RM {p.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right text-xs text-emerald-400/80 print:text-black">{p.epfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-bold text-xs bg-emerald-500/5 text-emerald-500 print:bg-transparent print:text-black">RM {p.employerCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right print:hidden">
                      <PayslipDialog data={p} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="p-4 bg-secondary/5 border-t border-border flex justify-between items-center print:hidden">
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

function PayslipDialog({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const dept = DEPARTMENTS.find(d => d.id === data.departmentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-accent hover:text-accent hover:bg-accent/10">
          <FileText className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Payslip</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white text-black p-0 overflow-hidden border-none">
        <div className="p-8 space-y-8 min-h-[800px] flex flex-col print:p-0 print:m-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">System Protocol Information Sdn Bhd</h2>
              <p className="text-xs font-medium text-slate-600">Unit 12-05, Menara Cyberjaya, Persiaran Multimedia</p>
              <p className="text-xs font-medium text-slate-600">63000 Cyberjaya, Selangor, Malaysia</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-slate-900 uppercase">PAY ADVICE</h1>
              <p className="text-sm font-bold bg-slate-900 text-white px-3 py-1 inline-block mt-2">JUNE 2026</p>
            </div>
          </div>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-12 text-sm">
            <div className="space-y-4">
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Staff Name</span>
                 <span className="col-span-2 font-black uppercase">{data.name}</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Staff ID</span>
                 <span className="col-span-2 font-bold">{data.id}</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Position</span>
                 <span className="col-span-2 font-bold">{data.position}</span>
               </div>
            </div>
            <div className="space-y-4 border-l pl-12 border-slate-100">
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Department</span>
                 <span className="col-span-2 font-bold">{dept?.name}</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Pay Date</span>
                 <span className="col-span-2 font-bold">25 June 2026</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Bank</span>
                 <span className="col-span-2 font-bold">Maybank Berhad</span>
               </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 grid grid-cols-2 border-t-2 border-slate-900">
            {/* Earnings Column */}
            <div className="border-r-2 border-slate-900">
              <div className="bg-slate-50 p-2 border-b border-slate-200">
                <span className="text-[11px] font-black uppercase">Earnings</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Basic Salary</span>
                  <span className="font-bold">{data.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Allowances</span>
                  <span className="font-bold">0.00</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div>
              <div className="bg-slate-50 p-2 border-b border-slate-200">
                <span className="text-[11px] font-black uppercase">Deductions</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">EPF (11%)</span>
                  <span className="font-bold">{data.epfStaff.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">SOCSO</span>
                  <span className="font-bold">{data.socsoStaff.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">EIS</span>
                  <span className="font-bold">{data.eisStaff.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">PCB Tax</span>
                  <span className="font-bold">{data.pcb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-2 border-y-2 border-slate-900 bg-slate-50">
            <div className="p-4 border-r-2 border-slate-900">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase">Gross Earnings</span>
                <span className="text-lg font-black text-slate-900">RM {data.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase">Total Deductions</span>
                <span className="text-lg font-black text-red-600">RM {data.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Net Pay Highlight */}
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center rounded-sm">
            <div className="space-y-1">
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Net Take Home Pay</h3>
               <p className="text-[10px] italic">Amount credited to your bank account.</p>
            </div>
            <div className="text-3xl font-black">RM {data.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>

          {/* Employer Contributions */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
            <h4 className="text-[10px] font-black uppercase mb-3 text-slate-400 tracking-widest">Employer Contributions (Statutory)</h4>
            <div className="flex gap-8">
               <div className="flex gap-2 text-xs">
                 <span className="font-bold text-slate-500">EPF:</span>
                 <span className="font-bold">RM {data.epfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex gap-2 text-xs">
                 <span className="font-bold text-slate-500">SOCSO/EIS:</span>
                 <span className="font-bold">RM {data.socsoEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
            </div>
          </div>

          <div className="mt-auto pt-8 flex justify-between items-end border-t border-slate-100">
             <div className="space-y-4">
                <div className="h-12 w-48 border-b border-slate-400"></div>
                <p className="text-[10px] font-bold uppercase">Employer's Signature</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] text-slate-400 font-medium">This is a computer generated payslip and no signature is required.</p>
                <p className="text-[9px] text-slate-400">Generated on {new Date().toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* Footer Actions - Hidden on Print */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={() => setOpen(false)} className="text-slate-600 border-slate-300">
            Close View
          </Button>
          <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print / Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
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
