"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Package, Monitor, DollarSign, Calendar, MapPin } from "lucide-react"
import { ASSETS, PROJECTS } from "@/lib/mock-data"

export default function NewAssetPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [syncedProjects, setSyncedProjects] = useState(PROJECTS)

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    refNo: "",
    category: "LOW_VALUE" as "CAPITAL" | "LOW_VALUE",
    price: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    location: "Pejabat Cyberjaya",
    projectId: "",
    status: "GOOD" as any
  })

  useEffect(() => {
    setMounted(true)
    const savedProjects = localStorage.getItem('simulated_projects')
    if (savedProjects) {
      setSyncedProjects(JSON.parse(savedProjects))
    }
    
    // Generate auto ref no hint
    const year = new Date().getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    setFormData(prev => ({ ...prev, refNo: `SPI/HQ/${year}/AST-${rand}` }))
  }, [])

  if (!isLoaded || !mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.refNo || !formData.price) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan butiran wajib aset.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    const currentAssets = JSON.parse(localStorage.getItem('simulated_assets') || JSON.stringify(ASSETS))
    const newAsset = {
      ...formData,
      id: `ast-${Date.now()}`,
      price: parseFloat(formData.price),
      currentHolderId: currentUser.id // Pencipta asal sebagai pemegang sementara
    }

    const updatedAssets = [...currentAssets, newAsset]
    localStorage.setItem('simulated_assets', JSON.stringify(updatedAssets))

    setTimeout(() => {
      toast({
        title: "Aset Didaftarkan",
        description: `Aset ${formData.name} telah berjaya direkodkan ke dalam sistem (KEW.PA).`,
      })
      setIsSubmitting(false)
      router.push("/assets")
    }, 1000)
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/assets")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Senarai Aset
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Daftar Aset Baru (KEW.PA)</h1>
          <p className="text-sm text-muted-foreground mt-1">Pendaftaran aset alih syarikat untuk tujuan inventori dan audit.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Maklumat Pendaftaran Aset
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="refNo">No. Siri Pendaftaran (KEW.PA)</Label>
                <Input 
                  id="refNo"
                  value={formData.refNo}
                  onChange={(e) => setFormData({...formData, refNo: e.target.value})}
                  className="bg-secondary/30 border-border font-mono text-xs uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori Aset</Label>
                <Select value={formData.category} onValueChange={(val: any) => setFormData({...formData, category: val})}>
                  <SelectTrigger className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="CAPITAL">KEW.PA-3 (Harta Modal &gt; RM5k)</SelectItem>
                    <SelectItem value="LOW_VALUE">KEW.PA-4 (Aset Nilai Rendah &lt; RM5k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5" /> Nama Aset
                </Label>
                <Input 
                  id="name"
                  placeholder="Contoh: Laptop Dell XPS 15"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model / Jenama</Label>
                <Input 
                  id="model"
                  placeholder="Contoh: XPS 9530"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" /> Harga Perolehan (RM)
                </Label>
                <Input 
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate" className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Tarikh Beli
                </Label>
                <Input 
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Penempatan & Lokasi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Asal / Simpanan</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-secondary/30 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Pautkan ke Projek (Opsional)</Label>
                  <Select value={formData.projectId} onValueChange={(val) => setFormData({...formData, projectId: val})}>
                    <SelectTrigger id="project" className="bg-secondary/30 border-border">
                      <SelectValue placeholder="Tiada (Simpan di Pejabat)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="none">Tiada / Pejabat</SelectItem>
                      {syncedProjects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground italic">Pautkan jika aset ini terus dihantar ke tapak projek.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/assets")} className="w-full md:flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Memproses..." : "Daftar Aset"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
