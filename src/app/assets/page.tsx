
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { ASSETS, PROJECTS, USERS, ASSET_MOVEMENTS } from "@/lib/mock-data"
import { 
  Package, 
  Search, 
  Plus, 
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
  HelpCircle,
  ArrowRightLeft,
  User,
  Briefcase,
  AlertCircle,
  X,
  Eye,
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
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AssetStatus } from "@/lib/types"

export default function AssetsPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  
  // Data States
  const [assetList, setAssetList] = useState(ASSETS)
  const [syncedProjects, setSyncedProjects] = useState(PROJECTS)
  const [syncedUsers, setSyncedUsers] = useState(USERS)
  
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [projectFilter, setProjectFilter] = useState<string>("ALL")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    setMounted(true)
    const savedAssets = localStorage.getItem('simulated_assets')
    const savedProjects = localStorage.getItem('simulated_projects')
    const savedUsers = localStorage.getItem('simulated_users')
    
    if (savedAssets) setAssetList(JSON.parse(savedAssets))
    if (savedProjects) setSyncedProjects(JSON.parse(savedProjects))
    if (savedUsers) setSyncedUsers(JSON.parse(savedUsers))
  }, [])

  const stats = useMemo(() => {
    const totalValue = assetList.reduce((sum, a) => sum + a.price, 0)
    const damaged = assetList.filter(a => a.status === 'DAMAGED').length
    const available = assetList.filter(a => a.status === 'GOOD' && !a.projectId).length
    return { totalValue, damaged, available }
  }, [assetList])

  const filteredAssets = useMemo(() => {
    return assetList.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                            a.refNo.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categoryFilter === "ALL" || a.category === categoryFilter
      
      const matchesProject = projectFilter === "ALL" ? true : 
                             projectFilter === "NONE" ? !a.projectId : 
                             a.projectId === projectFilter
      
      const isAvailable = a.status === 'GOOD' && !a.projectId;
      const isOnLoan = a.status === 'GOOD' && !!a.projectId;
      const isUnavailable = a.status !== 'GOOD';
      
      const matchesAvailability = availabilityFilter === "ALL" ? true :
                                  availabilityFilter === "AVAILABLE" ? isAvailable :
                                  availabilityFilter === "ON_LOAN" ? isOnLoan :
                                  availabilityFilter === "UNAVAILABLE" ? isUnavailable : true

      const matchesStatus = statusFilter === "ALL" ? true : a.status === statusFilter

      return matchesSearch && matchesCategory && matchesProject && matchesAvailability && matchesStatus
    })
  }, [assetList, search, categoryFilter, projectFilter, availabilityFilter, statusFilter])

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

  const resetFilters = () => {
    setCategoryFilter("ALL")
    setProjectFilter("ALL")
    setAvailabilityFilter("ALL")
    setStatusFilter("ALL")
    setSearch("")
  }

  const activeFilterCount = [
    categoryFilter !== "ALL",
    projectFilter !== "ALL",
    availabilityFilter !== "ALL",
    statusFilter !== "ALL"
  ].filter(Boolean).length

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Asset Value" value={`RM ${stats.totalValue.toLocaleString()}`} icon={BarChart2} color="text-indigo-500" />
        <StatCard title="Ready for Project (Good)" value={stats.available.toString()} icon={CheckCircle2} color="text-emerald-500" />
        <StatCard title="Damaged Assets" value={stats.damaged.toString()} icon={Wrench} color="text-red-500" />
      </div>

      <Card className="bg-card border-border shadow-2xl overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 w-full">
             <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Carian No. Rujukan atau Nama Aset..." 
                  className="pl-10 bg-secondary/30 border-border text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold border-border relative">
                    <Filter className="w-3.5 h-3.5" /> 
                    Filter Assets
                    {activeFilterCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-primary text-[8px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-card border-border w-64">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground">Filter Options</DropdownMenuLabel>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-[8px] gap-1 text-red-400 hover:text-red-500 hover:bg-red-500/10">
                        <X className="w-2.5 h-2.5" /> Reset
                      </Button>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">Availability</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border w-48">
                        <DropdownMenuCheckboxItem checked={availabilityFilter === 'ALL'} onCheckedChange={() => setAvailabilityFilter('ALL')} className="text-xs">All Status</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={availabilityFilter === 'AVAILABLE'} onCheckedChange={() => setAvailabilityFilter('AVAILABLE')} className="text-xs">Available (In Store)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={availabilityFilter === 'ON_LOAN'} onCheckedChange={() => setAvailabilityFilter('ON_LOAN')} className="text-xs">On Loan (Project)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={availabilityFilter === 'UNAVAILABLE'} onCheckedChange={() => setAvailabilityFilter('UNAVAILABLE')} className="text-xs">Unavailable (Damaged/Lost)</DropdownMenuCheckboxItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">Physical Condition</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border w-48">
                        <DropdownMenuCheckboxItem checked={statusFilter === 'ALL'} onCheckedChange={() => setStatusFilter('ALL')} className="text-xs">All Conditions</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'GOOD'} onCheckedChange={() => setStatusFilter('GOOD')} className="text-xs">Good Condition</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'DAMAGED'} onCheckedChange={() => setStatusFilter('DAMAGED')} className="text-xs">Damaged</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'LOST'} onCheckedChange={() => setStatusFilter('LOST')} className="text-xs">Lost</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'DISPOSED'} onCheckedChange={() => setStatusFilter('DISPOSED')} className="text-xs">Disposed</DropdownMenuCheckboxItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">By Project</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border w-56">
                        <DropdownMenuCheckboxItem checked={projectFilter === 'ALL'} onCheckedChange={() => setProjectFilter('ALL')} className="text-xs">All Projects</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={projectFilter === 'NONE'} onCheckedChange={() => setProjectFilter('NONE')} className="text-xs">In Store (No Project)</DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {syncedProjects.map(p => (
                          <DropdownMenuCheckboxItem 
                            key={p.id} 
                            checked={projectFilter === p.id} 
                            onCheckedChange={() => setProjectFilter(p.id)}
                            className="text-xs"
                          >
                            {p.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">KEW.PA Category</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border w-48">
                        <DropdownMenuCheckboxItem checked={categoryFilter === 'ALL'} onCheckedChange={() => setCategoryFilter('ALL')} className="text-xs">All Categories</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={categoryFilter === 'CAPITAL'} onCheckedChange={() => setCategoryFilter('CAPITAL')} className="text-xs">KEW.PA-3 (Capital)</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={categoryFilter === 'LOW_VALUE'} onCheckedChange={() => setCategoryFilter('LOW_VALUE')} className="text-xs">KEW.PA-4 (Low Value)</DropdownMenuCheckboxItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/10">
              <TableRow>
                <TableHead className="w-[150px] text-[10px] font-bold uppercase">No. Rujukan</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Aset / Model</TableHead>
                <TableHead className="text-[10px] font-bold uppercase">Project</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-center">Availability</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-center">Status</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => {
                const project = syncedProjects.find(p => p.id === asset.projectId)
                const isAvailable = asset.status === 'GOOD' && !asset.projectId;

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
                      {project ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                          <Briefcase className="w-3 h-3" />
                          {project.name}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">In Store</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isAvailable ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold px-2 py-0.5">
                          AVAILABLE
                        </Badge>
                      ) : asset.status !== 'GOOD' ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-bold px-2 py-0.5">
                          UNAVAILABLE
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-bold px-2 py-0.5">
                          ON LOAN
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
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
                      <div className="flex justify-end items-center gap-2">
                        {isAvailable && (
                          <RequestAssetDialog 
                            asset={asset} 
                            projects={syncedProjects} 
                            users={syncedUsers} 
                            currentUser={currentUser}
                            onSuccess={(updatedAsset) => {
                              const newList = assetList.map(a => a.id === updatedAsset.id ? updatedAsset : a);
                              setAssetList(newList);
                              localStorage.setItem('simulated_assets', JSON.stringify(newList));
                            }}
                          />
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 border border-border/50 hover:bg-accent/10" asChild title="Check Asset">
                           <Link href={`/assets/${asset.id}`}>
                             <Eye className="w-4 h-4 text-accent" />
                           </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 border border-border/50">
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
                            <DropdownMenuItem asChild>
                              <Link href={`/assets/${asset.id}/edit`} className="text-xs gap-2 cursor-pointer">
                                <Edit className="w-3.5 h-3.5 text-primary" /> Edit Maklumat Aset
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
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic text-sm">
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

function RequestAssetDialog({ asset, projects, users, currentUser, onSuccess }: { 
  asset: any, 
  projects: any[], 
  users: any[], 
  currentUser: any,
  onSuccess: (asset: any) => void 
}) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [purpose, setPurpose] = useState("");
  const { toast } = useToast();

  const handleRequest = () => {
    if (!projectId || !userId) {
      toast({ title: "Ralat", description: "Sila pilih projek dan kakitangan.", variant: "destructive" });
      return;
    }

    const selectedProject = projects.find(p => p.id === projectId);
    const selectedUser = users.find(u => u.id === userId);

    const updatedAsset = {
      ...asset,
      projectId,
      currentHolderId: userId,
      location: selectedProject?.name || asset.location
    };

    const newMovement = {
      id: `amov-${Date.now()}`,
      assetId: asset.id,
      userId: userId,
      projectId: projectId,
      checkoutDate: new Date().toISOString(),
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      purpose: purpose || "Keperluan Kerja Tapak",
      status: 'OUT',
      requestedBy: currentUser.name
    };

    const savedMovements = JSON.parse(localStorage.getItem('simulated_asset_movements') || JSON.stringify(ASSET_MOVEMENTS));
    localStorage.setItem('simulated_asset_movements', JSON.stringify([newMovement, ...savedMovements]));

    toast({
      title: "Aset Dikeluarkan",
      description: `${asset.name} telah dipindahkan ke projek ${selectedProject?.name}.`,
    });

    onSuccess(updatedAsset);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase">Issue Asset</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Briefcase className="w-5 h-5 text-primary" />
            Issue Asset to Project
          </DialogTitle>
          <DialogDescription>
            Sahkan penempatan aset <strong>{asset.name}</strong> ({asset.refNo}) ke tapak projek.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="proj">Target Project</Label>
            <Select onValueChange={setProjectId}>
              <SelectTrigger id="proj" className="bg-secondary/30">
                <SelectValue placeholder="Pilih Projek Aktif" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {projects.filter(p => p.status === 'ACTIVE').map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Responsible Staff (Assignee)</Label>
            <Select onValueChange={setUserId}>
              <SelectTrigger id="staff" className="bg-secondary/30">
                <SelectValue placeholder="Pilih Kakitangan" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Issuance</Label>
            <Input 
              id="purpose" 
              placeholder="Contoh: Pemasangan Server Tapak" 
              className="bg-secondary/30"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
             <div className="flex items-center gap-2 text-indigo-400">
               <User className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase">Requested By</span>
             </div>
             <p className="text-xs font-bold mt-1">{currentUser.name}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleRequest} className="bg-primary text-white font-bold">Generate KEW.PA-9 & Issue</Button>
        </DialogFooter>
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
