"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PROJECTS } from "@/lib/mock-data"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Briefcase, Plus, Search, Filter, MoreVertical, Edit2, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const { currentUser, isLoaded } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [projectList, setProjectList] = useState(PROJECTS)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('simulated_projects')
    if (saved) {
      setProjectList(JSON.parse(saved))
    }
  }, [])

  if (!isLoaded || !mounted) return null

  const isAdminOrHod = currentUser.role === 'ADMIN' || currentUser.role === 'HOD'

  const filteredProjects = projectList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">Project Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all company project portfolios.</p>
        </div>
        {isAdminOrHod && (
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-xl shadow-primary/20">
            <Link href="/projects/new">
              <Plus className="w-4 h-4" />
              Register New Project
            </Link>
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border py-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="text-accent w-5 h-5" />
                <CardTitle className="text-lg font-headline">Company Portfolios</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                  <Input 
                    placeholder="Search projects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary/30 border-border h-9 text-xs"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9 border-border">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="w-[300px]">Project Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-secondary/20 group transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {project.name.charAt(0)}
                        </div>
                        <span className="font-bold text-foreground text-sm">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{project.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold px-2 py-0.5 tracking-wider",
                        project.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        project.status === 'COMPLETED' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${project.id}`} className="text-xs font-medium gap-2 cursor-pointer">
                                <ExternalLink className="w-3.5 h-3.5" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            {isAdminOrHod && (
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}/edit`} className="text-xs font-medium gap-2 cursor-pointer">
                                  <Edit2 className="w-3.5 h-3.5" /> Edit Project
                                </Link>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                      Tiada projek ditemui untuk carian "{searchQuery}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
