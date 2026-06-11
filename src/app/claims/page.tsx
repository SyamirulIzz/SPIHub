"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CLAIMS, USERS, CURRENT_USER } from "@/lib/mock-data"
import { WalletCards, Upload, FileText, Check, X, Eye, DollarSign, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ClaimsPage() {
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isManagement = CURRENT_USER.role === 'ADMIN'

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Medical & General Claims</h1>
          <p className="text-muted-foreground mt-1">Submit receipts and track reimbursement status.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
          <Upload className="w-4 h-4" />
          New Claim
        </Button>
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
            <div className="text-3xl font-bold font-headline">RM 1,245.50</div>
            <p className="text-[10px] text-muted-foreground mt-1">Remaining from RM {CURRENT_USER.medicalClaimLimit.toLocaleString()}</p>
            <div className="h-1.5 w-full bg-secondary rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-accent" style={{ width: '62%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar className="w-3 h-3 text-primary" />
              Pending Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">RM 120.00</div>
            <p className="text-[10px] text-muted-foreground mt-1">2 claims awaiting verification</p>
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
              {CLAIMS.map((claim) => {
                const user = USERS.find(u => u.id === claim.userId)
                return (
                  <TableRow key={claim.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-semibold">{user?.name}</TableCell>
                    <TableCell className="text-xs">
                      {mounted ? new Date(claim.date).toLocaleDateString() : claim.date}
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
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                  <Button variant="outline" className="bg-background/80 border-border">View Original</Button>
                                </div>
                              </div>
                              {isManagement && claim.status === 'PENDING' && (
                                <div className="flex gap-4 pt-4">
                                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold">
                                    <Check className="w-4 h-4" /> Approve
                                  </Button>
                                  <Button variant="destructive" className="flex-1 gap-2 font-bold">
                                    <X className="w-4 h-4" /> Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {isManagement && claim.status === 'PENDING' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10">
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
