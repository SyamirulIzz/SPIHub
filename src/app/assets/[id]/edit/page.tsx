
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Package, Monitor, DollarSign, Calendar, Store, FileText } from "lucide-react"
import { ASSETS, PROJECTS } from "@/lib/mock-data"

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
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
    description: "",
    purchaseDate: "",
    location: "",
    projectId: "",
    status: "GOOD" as any
  })

  useEffect(() => {
    setMounted(true)
    const savedAssets = JSON.parse(localStorage.getItem('simulated_assets') || JSON.stringify(ASSETS))
    const assetToEdit = savedAssets.find((a: any) => a.id === id)
    
    if (assetToEdit) {
      setFormData({
        name: assetToEdit.name,
        model: assetToEdit.model,
        refNo: assetToEdit.refNo,
        category: assetToEdit.category,
        price: assetToEdit.price.toString(),
        description: assetToEdit.description || "",
        purchaseDate: assetToEdit.purchaseDate,
        location: assetToEdit.location,
        projectId: assetToEdit.projectId || "none",
        status: assetToEdit.status
      })
    }

    const savedProjects = localStorage.getItem('simulated_projects')
    if (savedProjects) {
      setSyncedProjects(JSON.parse(savedProjects))
    }
  }, [id])

  if (!isLoaded || !mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const currentAssets = JSON.parse(localStorage.getItem('simulated_assets') || JSON.stringify(ASSETS))
    
    let finalLocation = formData.location;
    if (formData.projectId && formData.projectId !== "none") {
      const proj = syncedProjects.find(p => p.id === formData.projectId);
      if (proj) finalLocation = `Tapak Projek: ${proj.name}`;
    }

    const updatedAssets = currentAssets.map((a: any) => {
      if (a.id === id) {
        return {
          ...a,
          ...formData,
          price: parseFloat(formData.price),
          location: finalLocation,
          projectId: formData.projectId === "none" ? undefined : formData.projectId
        }
      }
      return a
    })

    localStorage.setItem('simulated_assets', JSON.stringify(updatedAssets))

    setTimeout(() => {
      toast({
        title: "Kemaskini Berjaya",
        description: `Maklumat aset ${formData.name} telah berjaya dikemaskini.`,
      })
      setIsSubmitting(false)
      router.push("/assets")
    }, 800)
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/assets")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Senarai Aset
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Edit Maklumat Aset</h1>
          <p className="text-sm text-muted-foreground mt-1">Kemaskini rekod pendaftaran aset syarikat (KEW.PA).</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Borang Kemaskini Aset
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
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Deskripsi / Spesifikasi
              </Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-secondary/30 border-border min-h-[100px]"
              />
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
                <Store className="w-4 h-4" /> Penempatan & Lokasi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Semasa</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-secondary/30 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Paut ke Projek</Label>
                  <Select value={formData.projectId} onValueChange={(val) => setFormData({...formData, projectId: val})}>
                    <SelectTrigger id="project" className="bg-secondary/30 border-border">
                      <SelectValue placeholder="Tiada Projek (Dalam Stor)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="none">Dalam Stor (No Project)</SelectItem>
                      {syncedProjects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {isSubmitting ? "Menyimpan..." : "Simpan Kemaskini"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
