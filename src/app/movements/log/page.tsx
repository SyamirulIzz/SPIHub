"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, MapPin, Briefcase, Calendar as CalendarIcon, Clock, Upload } from "lucide-react"
import { PROJECTS, MOVEMENTS } from "@/lib/mock-data"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function LogMovementPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [projectId, setProjectId] = useState("")
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [destination, setDestination] = useState("")
  const [purpose, setPurpose] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [transportation, setTransportation] = useState("")
  const [claimable, setClaimable] = useState(false)

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) return null

  const activeProjects = PROJECTS.filter(p => p.status === 'ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !projectId || !category || !destination) {
      toast({ title: "Ralat", description: "Sila lengkapkan maklumat wajib.", variant: "destructive" })
      return
    }
    
    setIsSubmitting(true)
    
    const savedMovements = JSON.parse(localStorage.getItem('simulated_movements') || JSON.stringify(MOVEMENTS))
    const newMovement = {
      id: `mov-${Date.now()}`,
      userId: currentUser.id,
      projectId: projectId,
      startDate: `${format(startDate, "yyyy-MM-dd")}T${startTime}:00`,
      endDate: `${format(endDate || startDate, "yyyy-MM-dd")}T${endTime}:00`,
      allDay: false,
      destination: destination,
      purpose: purpose,
      description: "",
      category: category as any,
      contactPerson: contactPerson,
      contactOrg: "",
      transportation: transportation as any,
      claimable: claimable,
      movementType: 'OUT' as any,
      status: 'PENDING' as any,
      evidenceUrl: 'https://picsum.photos/seed/upload/800/600'
    }
    
    const updatedMovements = [newMovement, ...savedMovements]
    localStorage.setItem('simulated_movements', JSON.stringify(updatedMovements))

    setTimeout(() => {
      toast({
        title: "Pergerakan Direkod",
        description: "Maklumat pergerakan anda telah berjaya dihantar.",
      })
      setIsSubmitting(false)
      router.push("/movements")
    }, 1000)
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/movements")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Movement Log
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Log New Movement</h1>
          <p className="text-sm text-muted-foreground mt-1">Record your site visits or client meetings.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Movement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project" className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Project / Job
                </Label>
                <Select required onValueChange={setProjectId}>
                  <SelectTrigger id="project" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select active project" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {activeProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Movement Category</Label>
                <Select required onValueChange={setCategory}>
                  <SelectTrigger id="category" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="SITE_VISIT">Site Visit</SelectItem>
                    <SelectItem value="CLIENT_MEETING">Client Meeting</SelectItem>
                    <SelectItem value="LOGISTIC">Logistic / Delivery</SelectItem>
                    <SelectItem value="OUTSTATION">Outstation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> Start Date
                </Label>
                <div className="flex gap-2">
                  <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex-1 justify-start text-left font-normal bg-secondary/30 border-border",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yy") : <span>Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date)
                            setIsStartOpen(false)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-[100px] bg-secondary/30 border-border text-xs" 
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label className="flex items-center gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5" /> Expected End
                </Label>
                <div className="flex gap-2">
                  <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex-1 justify-start text-left font-normal bg-secondary/30 border-border",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yy") : <span>Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) {
                            setEndDate(date)
                            setIsEndOpen(false)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-[100px] bg-secondary/30 border-border text-xs" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination (Active Projects)</Label>
                <Select required onValueChange={setDestination}>
                  <SelectTrigger id="destination" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select project destination" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {activeProjects.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. System Installation" required className="bg-secondary/30 border-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transportation">Transportation</Label>
                <Select required onValueChange={setTransportation}>
                  <SelectTrigger id="transportation" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="CAR">Private/Company Car</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                    <SelectItem value="PUBLIC_TRANSPORT">Grab/Public Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence" className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Travel Evidence (Receipts/Photos)
                </Label>
                <Input id="evidence" type="file" className="bg-secondary/30 border-border text-xs cursor-pointer file:bg-primary file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2" />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Checkbox id="claimable" checked={claimable} onCheckedChange={(checked) => setClaimable(!!checked)} />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="claimable" className="text-sm font-bold text-primary">This movement is claimable</label>
                <p className="text-[10px] text-muted-foreground">Tick this if you plan to submit travel claims later.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex flex-col md:flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/movements")} className="w-full md:flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full md:flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Processing..." : "Log Movement"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
