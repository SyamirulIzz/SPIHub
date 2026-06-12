"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CLAIMS, USERS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Upload, Check, X, Eye, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ClaimsPage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [claimsList, setClaimsList] = useState(CLAIMS)
  const [isAdding, setIsAdding] = useState(false)
  const [claimDate, setClaimDate] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [desc, setDesc] = useState("")

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

  const isAdmin = currentUser.role === 'ADMIN'

  const visibleClaims = isAdmin 
    ? claimsList 
    : claimsList.filter(c => c.userId === currentUser.id)

  const handleClaimStatus = (id: string, status: 'APPROVED' | 'REJECTED', claimantName: string) => {
    setClaimsList(prev => prev.map(claim => 
      claim.id === id ? { ...claim, status } : claim
    ))

    toast({
      title: status === 'APPROVED' ? "Tuntutan Diluluskan" : "Tuntutan Ditolak",
      description: `Rekod tuntutan ${claimantName} telah dikemaskini.`,
      variant: status === 'REJECTED' ? "destructive" : "default",
    })
  }

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimDate || !category || !amount) {
      toast({
        title: "Ralat",
        description: "Sila lengkapkan semua maklumat permohonan.",
        variant: "destructive"
      })
      return
    }

    const newClaim = {
      id: `claim-${Date.now()}`,
      userId: currentUser.id,
      date: claimDate,
      amount: parseFloat(amount),
      category: category as any,
      description: desc,
      receiptUrl: 'https://picsum.photos/seed/newclaim/600/800',
      status: 'PENDING' as any
    }

    setClaimsList(prev => [newClaim, ...prev])
    setIsAdding(false)
    setAmount("")
    setDesc("")
    setClaimDate("")

    toast({
      title: "Tuntutan Dihantar",
      description: "Permohonan tuntutan anda telah berjaya dihantar."
    })
  }

  const approvedTotal = claimsList
    .filter(c => c.userId === currentUser.id && c.status === 'APPROVED')
    .reduce((sum, c) => sum + c.amount, 0)
    
  const remainingLimit = currentUser.medicalClaimLimit - approvedTotal

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-right-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Medical & General Claims</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Review company-wide claims and approvals." : "Submit receipts and track your personal claims."}
          </p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Upload className="w-4 h-4" />
              New Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-headline">Submit New Reimbursement</DialogTitle>
              <CardDescription>Fill in the expense details and upload receipt.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAddClaim} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="claimDate">Date</Label>
                  <Input 
                    id="claimDate"
                    type="date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="bg-secondary/30 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select required onValueChange={setCategory}>
                    <SelectTrigger className="bg-secondary/30 border-border text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="TRAVEL">Travel / Fuel</SelectItem>
                      <SelectItem value="GENERAL">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (RM)</Label>
                <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-secondary/30 border-border" required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Fever checkup" className="bg-secondary/30 border-border" required />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Receipt Document
                </Label>
                <Input type="file" required className="bg-secondary/30 border-border cursor-pointer file:bg-primary file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 text-xs" />
              </div>
              <DialogFooter className="pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-accent" />
              My Benefit Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold font-headline">RM {remainingLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Remaining from RM {currentUser.medicalClaimLimit.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border bg-secondary/10">
          <CardTitle className="text-lg font-headline">
            {isAdmin ? "All Company Claims" : "My Claims History"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleClaims.map((claim) => {
                const user = USERS.find(u => u.id === claim.userId)
                return (
                  <TableRow key={claim.id} className="hover:bg-secondary/10 transition-colors">
                    <TableCell className="text-xs font-semibold">{user?.name}</TableCell>
                    <TableCell className="text-[10px]">{claim.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase">{claim.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-accent">RM {claim.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-[8px] font-bold px-1.5 py-0.5", 
                        claim.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        claim.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-card border-border">
                            <DialogHeader><DialogTitle className="text-sm">Receipt View</DialogTitle></DialogHeader>
                            <div className="aspect-[3/4] relative rounded-lg border border-border overflow-hidden mt-4">
                              <Image src={claim.receiptUrl} alt="Receipt" fill className="object-contain" />
                            </div>
                          </DialogContent>
                        </Dialog>
                        {isAdmin && claim.status === 'PENDING' && (
                          <div className="flex gap-1">
                            <Button onClick={() => handleClaimStatus(claim.id, 'APPROVED', user?.name || '')} variant="ghost" size="icon" className="h-7 w-7 text-emerald-500"><Check className="w-3.5 h-3.5" /></Button>
                            <Button onClick={() => handleClaimStatus(claim.id, 'REJECTED', user?.name || '')} variant="ghost" size="icon" className="h-7 w-7 text-red-500"><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {visibleClaims.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">
                    Tiada rekod tuntutan ditemui.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
