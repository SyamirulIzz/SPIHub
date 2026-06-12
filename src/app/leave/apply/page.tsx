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
import { ArrowLeft, Send, Calendar as CalendarIcon, FileText, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LEAVE_REQUESTS } from "@/lib/mock-data"

export default function ApplyLeavePage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [leaveType, setLeaveType] = useState<string>("")
  const [reason, setReason] = useState("")

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !leaveType) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan semua maklumat permohonan.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    const savedRequests = JSON.parse(localStorage.getItem('simulated_leave_requests') || JSON.stringify(LEAVE_REQUESTS))
    const newRequest = {
      id: `leave-${Date.now()}`,
      userId: currentUser.id,
      leaveType: leaveType as any,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      reason: reason,
      status: 'PENDING'
    }
    
    const updatedRequests = [newRequest, ...savedRequests]
    localStorage.setItem('simulated_leave_requests', JSON.stringify(updatedRequests))

    setTimeout(() => {
      toast({
        title: "Permohonan Dihantar",
        description: "Permohonan cuti anda telah berjaya direkodkan.",
      })
      setIsSubmitting(false)
      router.push("/leave")
    }, 1000)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/leave")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Leave Log
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Apply For Leave</h1>
          <p className="text-sm text-muted-foreground mt-1">Sila isi butiran permohonan cuti anda.</p>
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
                <Select required onValueChange={setLeaveType}>
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
                  value={`${currentUser.annualLeaveLimit} Days`} 
                  disabled 
                  className="bg-secondary/10 border-border font-bold text-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> Start Date
                </Label>
                <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary/30 border-border",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setIsStartOpen(false)
                      }}
                      captionLayout="dropdown"
                      startMonth={new Date(2020, 0)}
                      endMonth={new Date(2030, 11)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> End Date
                </Label>
                <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary/30 border-border",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setIsEndOpen(false)
                      }}
                      captionLayout="dropdown"
                      startMonth={new Date(2020, 0)}
                      endMonth={new Date(2030, 11)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {leaveType === 'MEDICAL' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="mc_document" className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Medical Certificate (MC) Document
                </Label>
                <Input 
                  id="mc_document" 
                  type="file" 
                  className="bg-secondary/30 border-border cursor-pointer file:bg-primary file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
                  required
                />
                <p className="text-[10px] text-muted-foreground italic">Sila lampirkan salinan MC yang sah.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason / Description</Label>
              <Textarea 
                id="reason" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tujuan permohonan cuti..." 
                className="min-h-[100px] bg-secondary/30 border-border"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/leave")} className="w-full md:flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
