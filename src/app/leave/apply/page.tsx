
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, Calendar as CalendarIcon, FileText } from "lucide-react"

export default function ApplyLeavePage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulating API call
    setTimeout(() => {
      toast({
        title: "Permohonan Dihantar",
        description: "Permohonan cuti anda telah berjaya dihantar untuk kelulusan.",
      })
      setIsSubmitting(false)
      router.push("/leave")
    }, 1500)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/leave")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Leave Log
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Apply For Leave</h1>
          <p className="text-muted-foreground mt-1">Please fill in the details for your leave application.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Leave Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select required>
                  <SelectTrigger id="leaveType" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="MEDICAL">Medical Leave (MC)</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency Leave</SelectItem>
                    <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">AL available Balance</Label>
                <Input 
                  id="balance" 
                  value={`${currentUser.annualLeaveLimit - 4.5} Days`} 
                  disabled 
                  className="bg-secondary/10 border-border font-bold text-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> Start Date
                </Label>
                <Input id="startDate" type="date" required className="bg-secondary/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> End Date
                </Label>
                <Input id="endDate" type="date" required className="bg-secondary/30 border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason / Description</Label>
              <Textarea 
                id="reason" 
                placeholder="State the purpose of your leave application..." 
                className="min-h-[120px] bg-secondary/30 border-border"
                required
              />
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-muted-foreground">
              <strong>Notice:</strong> Applications for more than 3 days should be submitted at least 1 week in advance. For Medical Leave, you will be required to upload an MC slip in the main dashboard after this application is approved.
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/leave")} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
