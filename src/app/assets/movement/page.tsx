
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrentUser } from "@/hooks/use-current-user"
import { ASSETS, USERS, PROJECTS, ASSET_MOVEMENTS, DEPARTMENTS } from "@/lib/mock-data"
import { 
  History, 
  ArrowLeft, 
  Printer, 
  Search, 
  MapPin, 
  User, 
  Calendar,
  Package,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function AssetMovementLogPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [movements, setMovements] = useState(ASSET_MOVEMENTS)
  
  // Sync states for simulation integrity
  const [syncedAssets, setSyncedAssets] = useState(ASSETS)
  const [syncedUsers, setSyncedUsers] = useState(USERS)
  const [syncedProjects, setSyncedProjects] = useState(PROJECTS)

  useEffect(() => {
    setMounted(true)
    const savedMovements = localStorage.getItem('simulated_asset_movements')
    if (savedMovements) {
      setMovements(JSON.parse(savedMovements))
    }
    
    const savedAssets = localStorage.getItem('simulated_assets')
    if (savedAssets) setSyncedAssets(JSON.parse(savedAssets))
    
    const savedUsers = localStorage.getItem('simulated_users')
    if (savedUsers) setSyncedUsers(JSON.parse(savedUsers))
    
    const savedProjects = localStorage.getItem('simulated_projects')
    if (savedProjects) setSyncedProjects(JSON.parse(savedProjects))
  }, [])

  if (!isLoaded || !mounted) return null

  const filteredMovements = movements.filter(m => {
    const asset = syncedAssets.find(a => a.id === m.assetId)
    const user = syncedUsers.find(u => u.id === m.userId)
    return (
      asset?.name.toLowerCase().includes(search.toLowerCase()) ||
      user?.name.toLowerCase().includes(search.toLowerCase()) ||
      m.purpose.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/assets")} className="border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">Log Pergerakan Aset (KEW.PA-9)</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Rekod Peminjaman & Pemulangan Aset Syarikat</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30 h-7 px-3 uppercase tracking-tighter">
            Audit Ready
          </Badge>
        </div>
      </header>

      <Card className="bg-card border-border shadow-2xl overflow-hidden print:shadow-none print:border-0">
        <CardHeader className="bg-secondary/20 border-b border-border py-4 print:hidden">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari Staf, Aset atau Tujuan..." 
              className="pl-10 bg-secondary/30 border-border text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="text-[10px] font-bold uppercase">Staf / Pemohon</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Aset Dipinjam</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase">Destinasi / Projek</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Tempoh Pinjaman</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-center">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((m) => {
                  const asset = syncedAssets.find(a => a.id === m.assetId)
                  const user = syncedUsers.find(u => u.id === m.userId)
                  const project = syncedProjects.find(p => p.id === m.projectId)
                  return (
                    <TableRow key={m.id} className="hover:bg-secondary/20 transition-colors border-b border-border/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                            {user?.name.charAt(0) || '?'}
                          </div>
                          <span className="text-[10px] font-bold uppercase">{user?.name || 'Unknown Staff'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-foreground uppercase">{asset?.name || 'Unknown Asset'}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">{asset?.refNo || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-accent" /> {project?.name || 'No Project'}
                          </span>
                          <span className="text-[9px] text-muted-foreground italic">"{m.purpose}"</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-[9px] font-mono">
                          {new Date(m.checkoutDate).toLocaleDateString()}
                          <div className="text-muted-foreground">&rarr; {new Date(m.expectedReturnDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-bold px-1.5 py-0.5",
                          m.status === 'RETURNED' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <KewPa9PrintDialog movement={m} asset={asset} users={syncedUsers} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredMovements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic text-xs">
                      Tiada rekod pergerakan aset ditemui.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KewPa9PrintDialog({ movement, asset, users }: { movement: any, asset: any, users: any[] }) {
  const [open, setOpen] = useState(false);
  const applicant = users.find(u => u.id === movement.userId);
  const dept = DEPARTMENTS.find(d => d.id === applicant?.departmentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-accent hover:text-accent hover:bg-accent/10">
          <Printer className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">Cetak PA-9</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white text-black p-0 border-none overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Borang KEW.PA-9 - {asset?.name}</DialogTitle>
        </DialogHeader>
        <div className="p-10 min-h-[1000px] flex flex-col font-serif print:p-0 print:m-0 print:w-full">
           {/* Header Section */}
           <div className="flex justify-between items-start text-[10px] font-bold mb-4">
              <p>Pekeliling Perbendaharaan Malaysia</p>
              <div className="text-right">
                 <p>AM 2.4 Lampiran A</p>
                 <p className="mt-4 text-xs">KEW.PA-9</p>
              </div>
           </div>

           <div className="text-right mb-8">
              <p className="text-[10px]">No. Permohonan: <span className="border-b border-black border-dotted px-8">REQ-{movement.id.split('-')[1]}</span></p>
           </div>

           <h1 className="text-center text-sm font-bold uppercase mb-8 tracking-wide">BORANG PERMOHONAN PERGERAKAN/ PINJAMAN ASET ALIH</h1>

           {/* Table 1: Applicant Info */}
           <table className="w-full border-collapse border-2 border-black mb-8 text-[11px]">
              <tbody>
                <tr>
                   <td className="border-2 border-black p-2 w-1/4 font-bold">Nama Pemohon:</td>
                   <td className="border-2 border-black p-2 w-1/4 uppercase">{applicant?.name || '............................................'}</td>
                   <td className="border-2 border-black p-2 w-1/4 font-bold">Tujuan:</td>
                   <td className="border-2 border-black p-2 w-1/4">{movement.purpose}</td>
                </tr>
                <tr>
                   <td className="border-2 border-black p-2 font-bold">Jawatan:</td>
                   <td className="border-2 border-black p-2 uppercase">{applicant?.position || '............................................'}</td>
                   <td className="border-2 border-black p-2 font-bold">Tempat Digunakan:</td>
                   <td className="border-2 border-black p-2 uppercase">{movement.destination || 'TAPAK PROJEK'}</td>
                </tr>
                <tr>
                   <td className="border-2 border-black p-2 font-bold">Bahagian:</td>
                   <td className="border-2 border-black p-2 uppercase">{dept?.name || '............................................'}</td>
                   <td className="border-2 border-black p-2 font-bold">Nama Pengeluar:</td>
                   <td className="border-2 border-black p-2">............................................</td>
                </tr>
              </tbody>
           </table>

           {/* Table 2: Asset Details */}
           <table className="w-full border-collapse border-2 border-black text-[10px]">
              <thead>
                 <tr className="bg-slate-50">
                    <th rowSpan={2} className="border-2 border-black p-2 w-10 text-center">Bil</th>
                    <th rowSpan={2} className="border-2 border-black p-2">No. Siri Pendaftaran</th>
                    <th rowSpan={2} className="border-2 border-black p-2">Keterangan Aset</th>
                    <th colSpan={2} className="border-2 border-black p-2 text-center">Tarikh</th>
                    <th rowSpan={2} className="border-2 border-black p-2 text-center w-20">(Lulus / Tidak Lulus)</th>
                    <th colSpan={2} className="border-2 border-black p-2 text-center">Tarikh</th>
                    <th rowSpan={2} className="border-2 border-black p-2 w-24">Catatan</th>
                 </tr>
                 <tr className="bg-slate-50">
                    <th className="border-2 border-black p-1 text-center w-20">Peminjam</th>
                    <th className="border-2 border-black p-1 text-center w-20">Dijangka Pulang</th>
                    <th className="border-2 border-black p-1 text-center w-20">Dipulangkan</th>
                    <th className="border-2 border-black p-1 text-center w-20">Diterima</th>
                 </tr>
              </thead>
              <tbody>
                 {[1,2,3,4,5,6,7,8,9,10].map((idx) => (
                    <tr key={idx} className="h-8">
                       <td className="border-2 border-black text-center">{idx === 1 ? '1' : ''}</td>
                       <td className="border-2 border-black px-2">{idx === 1 ? asset?.refNo : ''}</td>
                       <td className="border-2 border-black px-2">{idx === 1 ? asset?.name : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? new Date(movement.checkoutDate).toLocaleDateString() : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? new Date(movement.expectedReturnDate).toLocaleDateString() : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? 'LULUS' : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 && movement.status === 'RETURNED' ? new Date(movement.checkoutDate).toLocaleDateString() : ''}</td>
                       <td className="border-2 border-black"></td>
                       <td className="border-2 border-black"></td>
                    </tr>
                 ))}
              </tbody>
           </table>

           <div className="mt-8 grid grid-cols-2 gap-20">
              <div className="space-y-12">
                 <p className="text-[10px] font-bold">Tandatangan Pemohon</p>
                 <div className="border-b border-black w-48"></div>
                 <p className="text-[9px] uppercase">({applicant?.name || '............................................'})</p>
                 <p className="text-[9px]">Tarikh: {new Date(movement.checkoutDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-12">
                 <p className="text-[10px] font-bold">Tandatangan Pelulus</p>
                 <div className="border-b border-black w-48"></div>
                 <p className="text-[9px]">Nama: ............................................</p>
                 <p className="text-[9px]">Tarikh: ............................................</p>
              </div>
           </div>

           <div className="mt-auto pt-10 text-[8px] italic text-slate-400">
              Borang ini dijana secara automatik melalui SPI HUB Asset Module.
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={() => setOpen(false)} className="text-slate-600 border-slate-300">
            Tutup
          </Button>
          <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2">
            <Printer className="w-4 h-4" />
            Cetak Borang KEW.PA-9
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
