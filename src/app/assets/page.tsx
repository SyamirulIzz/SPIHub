
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { ASSETS, PROJECTS, USERS } from "@/lib/mock-data"
import { 
  Package, 
  Search, 
  Plus, 
  ArrowUpRight, 
  History, 
  Wrench, 
  MapPin, 
  Monitor,
  Filter,
  FileText,
  BarChart2,
  MoreVertical,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { AssetStatus } from "@/lib/types"

export default function AssetsPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [assetList, setAssetList] = useState(ASSETS)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setMounted(true)
    const savedAssets = localStorage.getItem('simulated_assets')
    if (savedAssets) {
      setAssetList(JSON.parse(savedAssets))
    }
  }, [])

  const stats = useMemo(() => {
    const totalValue = assetList.reduce((sum, a) => sum + a.price, 0)
    const damaged = assetList.filter(a => a.status === 'DAMAGED').length
    const capitalAssets = assetList.filter(a => a.category === 'CAPITAL').length
    const onProject = assetList.filter(a => a.projectId).length
    return { totalValue, damaged, capitalAssets, onProject }
  }, [assetList])

  const filteredAssets = assetList.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.refNo.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusUpdate = (assetId: string, newStatus: AssetStatus) => {
    const updated = assetList.map(a => 
      a.id === assetId ? { ...a, status: newStatus } : a
    )
    setAssetList(updated)
    localStorage.setItem('simulated_assets', JSON.stringify(updated))
    
    toast({
      title: "Status Dikemaskini",
      description: `Aset berjaya ditukar kepada status ${newStatus}.`,
    })
  }

  if (!isLoaded || !mounted) return null

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
            <Package className="text-indigo-500 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">Asset Management</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Standard KEW.PA Compliance System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
            <Link href="/assets/new">
              <Plus className="w-4 h-4" /> Daftar Aset Baru
            </Link>
          </Button>
          <Button variant="outline" className="border-border gap-2" asChild>
            <Link href="/assets/movement">
               <History className="w-4 h-4" /> KEW.PA-9 Log
            </Link>
          </Button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Asset Value" value={`RM ${stats.totalValue.toLocaleString()}`} icon={BarChart2} color="text-indigo-500" />
        <StatCard title="Harta Modal (PA-3)" value={stats.capitalAssets.toString()} icon={Monitor} color="text-primary" />
        <StatCard title="Deployed at Sites" value={stats.onProject.toString()} icon={MapPin} color="text-emerald-500" />
        <StatCard title="Damage Reports" value={stats.damaged.toString()} icon={Wrench} color="text-red-500" />
      </div>

      <Card className="bg-card border-border shadow-2xl overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Carian No. Rujukan atau Nama Aset..." 
                  className="pl-10 bg-secondary/30 border-border text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold border-border">
                <Filter className="w-3.5 h-3.5" /> Filter Category
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/10">
              <TableRow>
                <TableHead className="w-[180px] text-[10px] font-bold uppercase">No. Rujukan (KEW.PA)</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Aset / Model</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Kategori</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Lokasi Semasa</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Pegawai / Staf</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => {
                const project = PROJECTS.find(p => p.id === asset.projectId)
                const holder = USERS.find(u => u.id === asset.currentHolderId)
                return (
                  <TableRow key={asset.id} className="hover:bg-secondary/20 transition-colors border-b border-border/50">
                    <TableCell className="font-mono text-[10px] font-bold text-accent">{asset.refNo}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase">{asset.name}</span>
                        <span className="text-[10px] text-muted-foreground">{asset.model}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-bold">
                        {asset.category === 'CAPITAL' ? 'KEW.PA-3' : 'KEW.PA-4'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {project ? project.name : asset.location}
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-[10px] font-medium">{holder?.name || 'Tersimpan'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold px-2 py-0.5",
                        asset.status === 'GOOD' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        asset.status === 'DAMAGED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        asset.status === 'LOST' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border w-48">
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Maklumat Aset</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/assets/${asset.id}`} className="text-xs gap-2 cursor-pointer">
                              <FileText className="w-3.5 h-3.5 text-accent" /> Lihat Borang KEW.PA
                            </Link>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Kemaskini Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(asset.id, 'GOOD')} className="text-xs gap-2 cursor-pointer">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Set kepada 'GOOD'
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(asset.id, 'DAMAGED')} className="text-xs gap-2 cursor-pointer">
                            <Wrench className="w-3.5 h-3.5 text-red-500" /> Set kepada 'DAMAGED'
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(asset.id, 'LOST')} className="text-xs gap-2 cursor-pointer">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Set kepada 'LOST'
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(asset.id, 'DISPOSED')} className="text-xs gap-2 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5 text-slate-500" /> Set kepada 'DISPOSED'
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground italic text-sm">
                    Tiada aset ditemui untuk carian anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
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
