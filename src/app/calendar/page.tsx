"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MOVEMENTS, 
  LEAVE_REQUESTS, 
  USERS, 
  CURRENT_USER 
} from "@/lib/mock-data"
import { CalendarDays, Info, Filter } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
  // Aggregate data for the "Shared Team Calendar" view
  // In a real app, this would be computed by month/week
  
  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">Shared Team Calendar</h1>
          <p className="text-muted-foreground mt-1">Real-time availability and movement coordination.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Company View</TabsTrigger>
              <TabsTrigger value="dept">My Department</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-border py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-primary w-5 h-5" />
                <span className="font-headline font-bold text-lg">May 2024</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span className="text-muted-foreground">Staff Movement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-accent"></div>
                  <span className="text-muted-foreground">Leave</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* High-density grid-based calendar simulation */}
            <div className="grid grid-cols-7 border-b border-border">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="py-2 text-center text-[10px] font-bold text-muted-foreground/60 border-r border-border last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 min-h-[600px]">
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2024-05-${dayNum.toString().padStart(2, '0')}`;
                
                // Filter movements for this day
                const dayMovements = MOVEMENTS.filter(m => m.startDate.startsWith(dateStr));
                const dayLeaves = LEAVE_REQUESTS.filter(l => l.startDate.startsWith(dateStr) && l.status === 'APPROVED');

                return (
                  <div key={i} className="min-h-[120px] p-2 border-r border-b border-border last:border-r-0 hover:bg-secondary/10 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                        dayNum === 15 ? "bg-primary text-primary-foreground" : "text-muted-foreground/40 group-hover:text-foreground"
                      )}>{dayNum}</span>
                    </div>
                    <div className="space-y-1.5 overflow-hidden">
                      {dayMovements.map(mov => {
                        const user = USERS.find(u => u.id === mov.userId);
                        return (
                          <div key={mov.id} className="text-[9px] px-1.5 py-1 rounded bg-primary/20 border-l-2 border-primary text-primary-foreground font-medium truncate">
                            {user?.name}: {mov.destination}
                          </div>
                        )
                      })}
                      {dayLeaves.map(leave => {
                        const user = USERS.find(u => u.id === leave.userId);
                        const isSelf = user?.id === CURRENT_USER.id;
                        const canSeeDetail = CURRENT_USER.role !== 'STAFF' || isSelf;

                        return (
                          <div key={leave.id} className="text-[9px] px-1.5 py-1 rounded bg-accent/20 border-l-2 border-accent text-accent-foreground font-medium truncate">
                            {user?.name}: {canSeeDetail ? leave.leaveType : 'On Leave'}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                Calendar Legend & Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• <span className="text-foreground font-semibold">Privacy Filter:</span> Standard staff only see "[Name] - On Leave". Detailed categories (AL, MC, EL) are restricted to HODs and Management.</p>
              <p>• <span className="text-foreground font-semibold">Real-time Sync:</span> Movements logged in Modul 1 appear instantly here.</p>
              <p>• <span className="text-foreground font-semibold">Site Visit Highlight:</span> Blue entries denote off-site client engagements.</p>
            </CardContent>
          </Card>
          
          <div className="flex flex-col justify-center gap-4">
             <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
               Log New Movement
             </button>
             <button className="bg-secondary hover:bg-muted border border-border text-foreground font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
               Apply For Leave
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
