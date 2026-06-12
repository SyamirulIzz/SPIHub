
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { USERS, DEPARTMENTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserPlus, MoreVertical, ShieldCheck, Mail, Building2, UserCircle2, Edit3, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function UserManagementPage() {
  const router = useRouter()
  const { currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [staffList, setStaffList] = useState(USERS)

  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem('simulated_users')
    if (savedUsers) {
      setStaffList(JSON.parse(savedUsers))
    } else {
      setStaffList(USERS)
      localStorage.setItem('simulated_users', JSON.stringify(USERS))
    }
  }, [])

  useEffect(() => {
    if (isLoaded && currentUser?.role !== 'ADMIN') {
      router.push("/")
    }
  }, [isLoaded, currentUser?.role, router])

  if (!isLoaded || !mounted || currentUser?.role !== 'ADMIN') return null

  const handleAction = (action: string, userName: string) => {
    toast({
      title: "Tindakan Berjaya",
      description: `${action} untuk ${userName} telah diproses.`,
    })
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Personnel Directory</h1>
          <p className="text-muted-foreground mt-1">Manage company staff records, roles, and benefits.</p>
        </div>
        <Button 
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-xl shadow-primary/20"
        >
          <Link href="/admin/users/new">
            <UserPlus className="w-4 h-4" />
            Onboard New Staff
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border py-4">
             <CardTitle className="text-lg font-headline flex items-center gap-2">
               <ShieldCheck className="text-accent w-5 h-5" />
               Role-Based Access Control (RBAC)
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="w-[300px]">Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Leave Limit</TableHead>
                  <TableHead>Claim Limit</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((user) => {
                  const dept = DEPARTMENTS.find(d => d.id === user.departmentId)
                  return (
                    <TableRow key={user.id} className="hover:bg-secondary/20 group transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold group-hover:scale-110 transition-transform">
                             {user.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-foreground">{user.name}</span>
                             <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                               <Mail className="w-2.5 h-2.5" /> {user.email}
                             </span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5" /> {dept?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[9px] font-bold tracking-widest px-2 py-0.5",
                          user.role === 'ADMIN' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          user.role === 'HOD' ? "bg-primary/10 text-primary border-primary/20" :
                          "bg-secondary text-muted-foreground"
                        )}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-bold text-emerald-500">
                        RM {user.salary?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">{user.annualLeaveLimit} Days</TableCell>
                      <TableCell className="text-sm font-semibold text-accent">
                        RM {user.medicalClaimLimit.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user.id}/edit`} className="text-xs font-medium focus:text-accent flex items-center gap-2">
                                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Deaktivasi Akaun", user.name)} className="text-xs font-medium text-red-500 focus:bg-red-500/10">Deactivate Account</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
