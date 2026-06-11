
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, MapPin, Briefcase, Calendar as CalendarIcon, Clock, Users, Truck } from "lucide-react"
import { PROJECTS } from "@/lib/mock-data"

export default function LogMovementPage() {
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
    
    // Simulating API call and saving to local storage
    setTimeout(() => {
      toast({
        title: "Pergerakan Direkod",
        description: "Maklumat pergerakan anda telah berjaya dihantar untuk rekod sistem.",
      })
      setIsSubmitting(false)
      router.push("/movements")
    }, 1500)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/movements")} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Movement Log
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Log New Movement</h1>
          <p className="text-muted-foreground mt-1">Record your field assignments, client meetings, or site visits.</p>
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
                <Select required>
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
                <Label htmlFor="category">Movement Category</Label>
                <Select required>
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
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> Start Date & Time
                </Label>
                <Input id="startDate" type="datetime-local" required className="bg-secondary/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Expected End Time
                </Label>
                <Input id="endDate" type="datetime-local" required className="bg-secondary/30 border-border" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address</Label>
                <Input id="destination" placeholder="e.g. AADK HQ, Kajang / Client Office Name" required className="bg-secondary/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Movement</Label>
                <Input id="purpose" placeholder="e.g. System UAT, Server Delivery, Weekly Meeting" required className="bg-secondary/30 border-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Client Contact Person
                </Label>
                <Input id="contactPerson" placeholder="Name of person at site" className="bg-secondary/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportation" className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5" /> Transportation
                </Label>
                <Select required>
                  <SelectTrigger id="transportation" className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="CAR">Company Car / Private Car</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                    <SelectItem value="PUBLIC_TRANSPORT">Public Transport / Grab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly explain what tasks will be carried out..." 
                className="min-h-[100px] bg-secondary/30 border-border"
              />
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Checkbox id="claimable" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="claimable"
                  className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
                >
                  This movement is claimable
                </label>
                <p className="text-[10px] text-muted-foreground">
                  Tick this if you plan to submit travel/mileage claims later. Evidence will be required.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border p-6 flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/movements")} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Processing..." : "Log Movement"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
