
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, UserCog, Shield, Building, Briefcase, Save, DollarSign } from "lucide-react"
import { USERS, DEPARTMENTS } from "@/lib/mock-data"

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    departmentId: "",
    role: "STAFF",
    annualLeaveLimit: "14",
    medicalClaimLimit: "1000",
    salary: "0"
  })

  useEffect(() => {
    setMounted(true)
    const savedUsers = JSON.parse(localStorage.getItem('simulated_users') || JSON.stringify(USERS))
    const userToEdit = savedUsers.find((u: any) => u.id === id)
    
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        position: userToEdit.position,
        departmentId: userToEdit.departmentId,
        role: userToEdit.role,
        annualLeaveLimit: userToEdit.annualLeaveLimit.toString(),
        medicalClaimLimit: userToEdit.medicalClaimLimit.toString(),
        salary: (userToEdit.salary || 0).toString()
      })
    }
  }, [id])

  useEffect(() => {
    if (isLoaded && currentUser?.role !== 'ADMIN') {
      router.push("/")
    }
  }, [isLoaded, currentUser?.role, router])

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const currentUsers = JSON.parse(localStorage.getItem('simulated_users') || JSON.stringify(USERS))
    const updatedUsers = currentUsers.map((u: any) => {
      if (u.id === id) {
        return {
          ...u,
          ...formData,
          annualLeaveLimit: parseInt(formData.annualLeaveLimit),
          medicalClaimLimit: parseInt(formData.medicalClaimLimit),
          salary: parseFloat(formData.salary),
          role: formData.role as any
        }
      }
      return u
    })

    localStorage.setItem('simulated_users', JSON.stringify(updatedUsers))

    setTimeout(() => {
      toast({
        title: "Kemaskini Berjaya",
        description: `Profil ${formData.name} telah dikemaskini.`,
      })
      setIsSubmitting(false)
      router.push("/admin/users")
    }, 800)
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/admin/users")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Edit Staff Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Kemaskini rekod dan akses sistem kakitangan.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Update Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Position / Title
                </Label>
                <Input 
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5" /> Department
                </Label>
                <div className="relative">
                  <Select value={formData.departmentId} onValueChange={(val) => setFormData({...formData, departmentId: val})}>
                    <SelectTrigger id="department" className="bg-secondary/30 border-border">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> System Role (RBAC)
                </Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger id="role" className="bg-secondary/30 border-border font-bold">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="STAFF">STAFF (Basic Access)</SelectItem>
                    <SelectItem value="HOD">HOD (Approval Access)</SelectItem>
                    <SelectItem value="ADMIN">ADMIN (Full Control)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" /> Basic Salary (RM)
                </Label>
                <Input 
                  id="salary"
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="annualLeave">Annual Leave Limit (Days)</Label>
                <Input 
                  id="annualLeave"
                  type="number"
                  value={formData.annualLeaveLimit}
                  onChange={(e) => setFormData({...formData, annualLeaveLimit: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalClaim">Medical Claim Limit (RM)</Label>
                <Input 
                  id="medicalClaim"
                  type="number"
                  value={formData.medicalClaimLimit}
                  onChange={(e) => setFormData({...formData, medicalClaimLimit: e.target.value})}
                  className="bg-secondary/30 border-border"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/users")} className="w-full md:flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving Changes..." : "Save Profile Updates"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
