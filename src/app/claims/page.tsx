
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CLAIMS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Upload, Check, X, Eye, DollarSign, Calendar as CalendarIcon, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function ClaimsPage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [claimsList, setClaimsList] = useState(CLAIMS)
  const [isAdding, setIsAdding] = useState(false)
  const [claimDate, setClaimDate] = useState<Date>()

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('simulated_claims')
    if (saved) {
      setClaimsList(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simulated_claims', JSON.stringify(claimsList))
    }
  }, [claimsList, mounted])

  if (!isLoaded || !mounted) return null

  const canProcessClaims = currentUser.role === 'ADMIN' || currentUser.role === 'HOD'

  const handleClaimStatus = (id: string, status: 'APPROVED' | 'REJECTED', claimId: string) => {
    setClaimsList(prev => prev.map(claim => 
      claim.id === id ? { ...claim, status } : claim
    ))

    toast({
      title: status === 'APPROVED' ? "Tuntutan Diluluskan" : "Tuntutan Ditolak",
      description: `Rekod tuntutan ${claimId} telah dikemaskini kepada status ${status}.`,
      variant: status === 'REJECTED' ? "destructive" : "default",
    })
  }

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Tuntutan Dihantar",
      description: "Permohonan tuntutan anda telah berjaya dihantar untuk pengesahan."
    })
    setIsAdding(false)
  }

  const approvedTotal = claimsList
    .filter(c => c.userId === currentUser.id && c.status === 'APPROVED')
    .reduce((sum, c) => sum + c.amount, 0)
    
  const remainingLimit = currentUser.medicalClaimLimit - approvedTotal

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Medical & General Claims</h1>
          <p className="text-muted-foreground mt-1">Submit receipts and track reimbursement status.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Upload className="w-4 h-4" />
              New Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-headline">Submit New Reimbursement</DialogTitle>
              <CardDescription>Fill in the expense details and upload your receipt.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAddClaim} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label>Date of Expense</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal bg-secondary/30 border-border",
                          !claimDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {claimDate ? format(claimDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar mode="single" selected={claimDate} onSelect={setClaimDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger className="bg-secondary/30 border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="TRAVEL">Travel / Fuel</SelectItem>
                      <SelectItem value="GENERAL">General Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (RM)</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" className="bg-secondary/30 border-border" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" placeholder="e.g. Fever checkup, Toll to Kajang" className="bg-secondary/30 border-border" required />
              </div>
              <div className="space-y-2">
                <Label>Receipt File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">Click to upload receipt (JPG/PNG/PDF)</span>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold">Submit Claim</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-accent" />
              Annual Benefit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">RM {remainingLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Remaining from RM {currentUser.medicalClaimLimit.toLocaleString()}</p>
            <div className="h-1.5 w-full bg-secondary rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-accent" style={{ width: `${(remainingLimit/currentUser.medicalClaimLimit)*100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              Pending Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">
              RM {claimsList.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.amount, 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{claimsList.filter(c => c.status === 'PENDING').length} claims awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border bg-secondary/20">
          <CardTitle className="text-lg font-headline">Claims History</CardTitle>
          <CardDescription>Comprehensive log of all submitted expenses.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/10">
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimsList.map((claim) => {
                const user = USERS.find(u => u.id === claim.userId)
                return (
                  <TableRow key={claim.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-semibold">{user?.name}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(claim.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-bold tracking-widest uppercase">
                        {claim.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-accent">RM {claim.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold px-2 py-0.5",
                        claim.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        claim.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-accent">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="font-headline">Receipt Verification</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="flex justify-between items-start bg-secondary/30 p-4 rounded-lg border border-border">
                                <div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Claimant</p>
                                  <p className="text-lg font-bold">{user?.name}</p>
                                  <p className="text-xs text-accent mt-1">{claim.category} &bull; {claim.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Verified Amount</p>
                                  <p className="text-2xl font-bold font-mono text-foreground">RM {claim.amount.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border-2 border-dashed border-border group">
                                <Image 
                                  src={claim.receiptUrl} 
                                  alt="Receipt Preview" 
                                  fill 
                                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                                />
                              </div>
                              {canProcessClaims && claim.status === 'PENDING' && (
                                <div className="flex gap-4 pt-4">
                                  <Button onClick={() => handleClaimStatus(claim.id, 'APPROVED', claim.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold">
                                    <Check className="w-4 h-4" /> Approve
                                  </Button>
                                  <Button onClick={() => handleClaimStatus(claim.id, 'REJECTED', claim.id)} variant="destructive" className="flex-1 gap-2 font-bold">
                                    <X className="w-4 h-4" /> Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {canProcessClaims && claim.status === 'PENDING' && (
                          <div className="flex gap-1">
                            <Button onClick={() => handleClaimStatus(claim.id, 'APPROVED', claim.id)} variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleClaimStatus(claim.id, 'REJECTED', claim.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
