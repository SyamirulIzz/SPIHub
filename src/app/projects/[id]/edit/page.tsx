"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Briefcase, Info } from "lucide-react"
import { PROJECTS } from "@/lib/mock-data"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "COMPLETED" | "ON_HOLD"
  })

  useEffect(() => {
    setMounted(true)
    const currentProjects = JSON.parse(localStorage.getItem('simulated_projects') || JSON.stringify(PROJECTS))
    const projectToEdit = currentProjects.find((p: any) => p.id === id)
    
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name,
        description: projectToEdit.description,
        status: projectToEdit.status
      })
    }
  }, [id])

  useEffect(() => {
    if (isLoaded && currentUser?.role !== 'ADMIN') {
      router.push("/projects")
    }
  }, [isLoaded, currentUser?.role, router])

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan butiran wajib projek.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    const currentProjects = JSON.parse(localStorage.getItem('simulated_projects') || JSON.stringify(PROJECTS))
    const updatedProjects = currentProjects.map((p: any) => {
      if (p.id === id) {
        return {
          ...p,
          ...formData
        }
      }
      return p
    })

    localStorage.setItem('simulated_projects', JSON.stringify(updatedProjects))

    setTimeout(() => {
      toast({
        title: "Projek Dikemaskini",
        description: `Maklumat projek ${formData.name} telah berjaya disimpan.`,
      })
      setIsSubmitting(false)
      router.push(`/projects/${id}`)
    }, 800)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push(`/projects/${id}`)} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Edit Project Details</h1>
          <p className="text-sm text-muted-foreground mt-1">Kemaskini rekod portfolio projek.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Update Project Master
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-secondary/30 border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                <SelectTrigger id="status" className="bg-secondary/30 border-border font-bold">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ACTIVE">ACTIVE - Ongoing development</SelectItem>
                  <SelectItem value="COMPLETED">COMPLETED - Project closed</SelectItem>
                  <SelectItem value="ON_HOLD">ON HOLD - Pending resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Scope of Work</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[200px] bg-secondary/30 border-border"
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Sebarang perubahan status akan direkodkan dan dipaparkan pada Dashboard Operasi sebagai data real-time.
              </p>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/projects/${id}`)} className="w-full md:flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Project Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}