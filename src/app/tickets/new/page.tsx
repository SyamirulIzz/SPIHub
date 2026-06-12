"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, Ticket, AlertCircle, Briefcase, Upload } from "lucide-react"
import { PROJECTS, TICKETS } from "@/lib/mock-data"

export default function NewTicketPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    projectId: "",
    subject: "",
    description: "",
    severity: "Low" as "Low" | "Medium" | "High"
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.projectId || !formData.subject || !formData.description) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan semua maklumat tiket.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    const currentTickets = JSON.parse(localStorage.getItem('simulated_tickets') || JSON.stringify(TICKETS))
    const newTicket = {
      id: `tick-${Date.now()}`,
      projectId: formData.projectId,
      createdBy: currentUser.id,
      assignedTo: undefined,
      subject: formData.subject,
      description: formData.description,
      severity: formData.severity,
      status: 'Open' as any,
      createdAt: new Date().toISOString(),
      attachmentUrl: 'https://picsum.photos/seed/ticket-doc/800/600' // Simulated attachment
    }

    const updatedTickets = [newTicket, ...currentTickets]
    localStorage.setItem('simulated_tickets', JSON.stringify(updatedTickets))

    setTimeout(() => {
      toast({
        title: "Tiket Dicipta",
        description: "Tiket bantuan anda telah berjaya dihantar ke pasukan teknikal.",
      })
      setIsSubmitting(false)
      router.push("/tickets")
    }, 1000)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/tickets")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Helpdesk
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Create Support Ticket</h1>
          <p className="text-sm text-muted-foreground mt-1">Sila nyatakan isu teknikal atau permohonan bantuan projek anda.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Ticket Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project" className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Related Project
                </Label>
                <Select required onValueChange={(val) => setFormData({...formData, projectId: val})}>
                  <SelectTrigger id="project" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {PROJECTS.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity" className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" /> Severity Level
                </Label>
                <Select defaultValue="Low" onValueChange={(val: any) => setFormData({...formData, severity: val})}>
                  <SelectTrigger id="severity" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Low">Low - General inquiry</SelectItem>
                    <SelectItem value="Medium">Medium - Minor bug / Issue</SelectItem>
                    <SelectItem value="High">High - Critical / Blocker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject / Title</Label>
              <Input 
                id="subject"
                placeholder="Brief summary of the issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="bg-secondary/30 border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Explain the problem or request in detail..." 
                className="min-h-[150px] bg-secondary/30 border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment" className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" /> Attachment / Document (Screenshot, Logs, etc.)
              </Label>
              <Input 
                id="attachment" 
                type="file" 
                className="bg-secondary/30 border-border text-xs cursor-pointer file:bg-primary file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
              />
              <p className="text-[10px] text-muted-foreground italic">Muat naik bukti atau tangkapan skrin untuk membantu pasukan teknikal.</p>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/tickets")} className="w-full md:flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
