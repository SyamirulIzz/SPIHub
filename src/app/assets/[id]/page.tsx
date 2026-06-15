
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ASSETS, PROJECTS, USERS, DEPARTMENTS, ASSET_MOVEMENTS, ASSET_DAMAGE_REPORTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  History, 
  Wrench, 
  ShieldCheck,
  Building,
  Calendar,
  DollarSign,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [asset, setAsset] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const savedAssets = JSON.parse(localStorage.getItem('simulated_assets') || JSON.stringify(ASSETS))
    const found = savedAssets.find((a: any) => a.id === id)
    setAsset(found)
  }, [id])

  if (!isLoaded || !mounted || !asset) return null

  const project = PROJECTS.find(p => p.id === asset.projectId)
  const holder = USERS.find(u => u.id === asset.currentHolderId)
  const movements = ASSET_MOVEMENTS.filter(m => m.assetId === asset.id)
  const reports = ASSET_DAMAGE_REPORTS.filter(r => r.assetId === asset.id)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/assets")} className="border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground">{asset.name}</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{asset.refNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2">
            <Printer className="w-4 h-4" /> Cetak Borang KEW.PA-3/4
          </Button>
          <Badge className="bg-primary/20 text-primary border-primary/30 h-7 px-3 uppercase tracking-tighter">
            {asset.category === 'CAPITAL' ? 'Harta Modal' : 'Aset Bernilai Rendah'}
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="kewpa" className="space-y-6">
        <TabsList className="bg-secondary/30 border border-border p-1 h-12 print:hidden">
          <TabsTrigger value="kewpa" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary">
            <FileText className="w-4 h-4" /> DAFTAR ASET (PA-3/4)
          </TabsTrigger>
          <TabsTrigger value="movement" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary">
            <History className="w-4 h-4" /> PERGERAKAN (PA-9)
          </TabsTrigger>
          <TabsTrigger value="damage" className="gap-2 px-6 h-full font-bold text-xs data-[state=active]:bg-primary">
            <Wrench className="w-4 h-4" /> KEROSAKAN (PA-10)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: KEW.PA-3/4 View */}
        <TabsContent value="kewpa" className="print:m-0 print:block">
           <Card className="bg-card border-border shadow-2xl overflow-hidden print:shadow-none print:border-black print:text-black print:bg-white print:rounded-none">
             <CardHeader className="bg-secondary/10 border-b border-border text-center py-8 print:bg-white print:border-b-2 print:border-black">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-bold border border-black px-2 py-1 uppercase">{asset.category === 'CAPITAL' ? 'KEW.PA-3' : 'KEW.PA-4'}</p>
                   <div className="text-right">
                      <p className="text-[8px] font-bold">No. Siri Pendaftaran: {asset.refNo}</p>
                   </div>
                </div>
                <h2 className="text-lg font-bold font-headline uppercase tracking-widest print:text-black">DAFTAR {asset.category === 'CAPITAL' ? 'HARTA MODAL' : 'ASET ALIH BERNILAI RENDAH'}</h2>
                <p className="text-sm font-bold uppercase mt-2 print:text-black">SYSTEM PROTOCOL INFORMATION SDN BHD</p>
             </CardHeader>
             <CardContent className="p-8 space-y-8 print:text-black">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                   <div className="space-y-4 border-r border-border pr-12 print:border-black">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary print:text-black">Bahagian A: Butiran Aset</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                         <span className="text-muted-foreground font-bold print:text-slate-600">Nama Aset:</span>
                         <span className="col-span-2 font-black uppercase">{asset.name}</span>
                         
                         <span className="text-muted-foreground font-bold print:text-slate-600">Model/Jenama:</span>
                         <span className="col-span-2 font-bold">{asset.model}</span>
                         
                         <span className="text-muted-foreground font-bold print:text-slate-600">No. Siri Pembuat:</span>
                         <span className="col-span-2 font-mono">SN-998822-X</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary print:text-black">Bahagian B: Perolehan</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                         <span className="text-muted-foreground font-bold print:text-slate-600">Tarikh Beli:</span>
                         <span className="col-span-2 font-bold">{asset.purchaseDate}</span>
                         
                         <span className="text-muted-foreground font-bold print:text-slate-600">Harga (RM):</span>
                         <span className="col-span-2 font-bold text-accent print:text-black">{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         
                         <span className="text-muted-foreground font-bold print:text-slate-600">Lokasi Asal:</span>
                         <span className="col-span-2 font-bold">{asset.location}</span>
                      </div>
                   </div>
                </div>

                <div className="border-t border-border pt-8 mt-8 print:border-black">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 print:text-black">Penempatan Semasa</h4>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/20 border border-border print:border-black print:bg-white">
                         <p className="text-[9px] text-muted-foreground font-bold uppercase print:text-black">Lokasi / Projek</p>
                         <p className="text-sm font-black mt-1 uppercase">{project ? project.name : asset.location}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/20 border border-border print:border-black print:bg-white">
                         <p className="text-[9px] text-muted-foreground font-bold uppercase print:text-black">Staf Bertanggungjawab</p>
                         <p className="text-sm font-black mt-1 uppercase">{holder?.name || 'DALAM STOR'}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/20 border border-border print:border-black print:bg-white">
                         <p className="text-[9px] text-muted-foreground font-bold uppercase print:text-black">Status Fizikal</p>
                         <div className="flex items-center gap-2 mt-1">
                            <div className={cn("h-2 w-2 rounded-full", asset.status === 'GOOD' ? "bg-emerald-500" : "bg-red-500")} />
                            <p className="text-sm font-black uppercase">{asset.status}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-auto pt-20 flex justify-between items-end">
                   <div className="space-y-4">
                      <div className="h-px w-48 bg-black"></div>
                      <p className="text-[9px] font-bold uppercase">Tandatangan Pegawai Aset</p>
                      <p className="text-[8px] text-muted-foreground">SPI/HR/ASSET-UNIT</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] text-muted-foreground italic">Borang ini dijana secara automatik melalui SPI HUB</p>
                      <p className="text-[8px] font-bold uppercase">Tarikh Cetakan: {new Date().toLocaleDateString()}</p>
                   </div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Tab 2: Movement Log (KEW.PA-9) */}
        <TabsContent value="movement">
           <Card className="bg-card border-border shadow-xl">
             <CardHeader className="bg-secondary/10 border-b border-border">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                   <History className="w-4 h-4 text-accent" /> Log Pergerakan Aset (KEW.PA-9)
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                {movements.length > 0 ? (
                  <div className="divide-y divide-border">
                    {movements.map((m: any) => {
                      const user = USERS.find(u => u.id === m.userId)
                      const proj = PROJECTS.find(p => p.id === m.projectId)
                      return (
                        <div key={m.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                                {user?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase">{user?.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                   <Building className="w-2.5 h-2.5" /> {proj?.name}
                                </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Tujuan: {m.purpose}</p>
                                <p className="text-[9px] font-mono mt-1">{new Date(m.checkoutDate).toLocaleDateString()} &rarr; {new Date(m.expectedReturnDate).toLocaleDateString()}</p>
                              </div>
                              <KewPa9PrintDialog movement={m} asset={asset} />
                           </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground italic text-xs">
                    Tiada rekod pergerakan luaran untuk aset ini.
                  </div>
                )}
             </CardContent>
           </Card>
        </TabsContent>

        {/* Tab 3: Damage Reports (KEW.PA-10) */}
        <TabsContent value="damage">
           <Card className="bg-card border-border shadow-xl border-t-4 border-t-red-500">
             <CardHeader className="bg-secondary/10 border-b border-border">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                   <Wrench className="w-4 h-4 text-red-500" /> Aduan Kerosakan Aset (KEW.PA-10)
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                {reports.length > 0 ? reports.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 space-y-3">
                     <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 font-bold text-[9px]">{r.status}</Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">{r.damageDate}</span>
                     </div>
                     <p className="text-xs font-medium italic">"{r.description}"</p>
                     <div className="pt-3 border-t border-red-500/10 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold uppercase">U</div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Dilapor oleh Staf Operasi</span>
                     </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                     <ShieldCheck className="w-12 h-12 text-emerald-500 opacity-20 mx-auto mb-3" />
                     <p className="text-xs text-muted-foreground italic">Tiada aduan kerosakan aktif.</p>
                  </div>
                )}
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function KewPa9PrintDialog({ movement, asset }: { movement: any, asset: any }) {
  const [open, setOpen] = useState(false);
  const applicant = USERS.find(u => u.id === movement.userId);
  const dept = DEPARTMENTS.find(d => d.id === applicant?.departmentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 border-accent text-accent hover:bg-accent/10">
          <Printer className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Cetak PA-9</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white text-black p-0 border-none overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Borang KEW.PA-9 - {asset.name}</DialogTitle>
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
                   <td className="border-2 border-black p-2 w-1/4 uppercase">{applicant?.name}</td>
                   <td className="border-2 border-black p-2 w-1/4 font-bold">Tujuan:</td>
                   <td className="border-2 border-black p-2 w-1/4">{movement.purpose}</td>
                </tr>
                <tr>
                   <td className="border-2 border-black p-2 font-bold">Jawatan:</td>
                   <td className="border-2 border-black p-2 uppercase">{applicant?.position}</td>
                   <td className="border-2 border-black p-2 font-bold">Tempat Digunakan:</td>
                   <td className="border-2 border-black p-2 uppercase">{movement.destination}</td>
                </tr>
                <tr>
                   <td className="border-2 border-black p-2 font-bold">Bahagian:</td>
                   <td className="border-2 border-black p-2 uppercase">{dept?.name}</td>
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
                       <td className="border-2 border-black px-2">{idx === 1 ? asset.refNo : ''}</td>
                       <td className="border-2 border-black px-2">{idx === 1 ? asset.name : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? new Date(movement.checkoutDate).toLocaleDateString() : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? new Date(movement.expectedReturnDate).toLocaleDateString() : ''}</td>
                       <td className="border-2 border-black text-center">{idx === 1 ? (movement.status === 'APPROVED' ? 'LULUS' : '') : ''}</td>
                       <td className="border-2 border-black"></td>
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
                 <p className="text-[9px] uppercase">({applicant?.name})</p>
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
