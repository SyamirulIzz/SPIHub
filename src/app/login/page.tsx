
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/hooks/use-toast"
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, currentUser, isLoaded } = useCurrentUser()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoaded && currentUser) {
      router.push("/")
    }
  }, [isLoaded, currentUser, router])

  if (!isLoaded || currentUser) return null

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = login(email)

    if (success) {
      toast({
        title: "Log Masuk Berjaya",
        description: "Selamat datang ke SPI HUB.",
      })
      router.push("/")
    } else {
      toast({
        title: "Ralat Log Masuk",
        description: "Emel tidak ditemui dalam sistem. Sila hubungi Admin.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/40 mb-2">
            <div className="relative h-12 w-12 flex items-center justify-center">
               <span className="text-4xl font-bold font-headline text-white">S</span>
               <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent rounded-full border-2 border-primary"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tighter text-foreground">SPI HUB</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">System Protocol Information</p>
          </div>
          <p className="text-sm text-muted-foreground">Internal HR & Operations Management System</p>
        </div>

        <Card className="bg-card border-border shadow-2xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Staff Login
            </CardTitle>
            <CardDescription>Masukkan emel korporat anda untuk akses.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@systemprotocol.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/30 border-border"
                    required
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/20 border border-border flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Akses dihadkan kepada kakitangan System Protocol Information Sdn Bhd sahaja.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 py-6">
                {isSubmitting ? "Authenticating..." : "Login to Workspace"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>

        <footer className="text-center">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1 opacity-50">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Real-time</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Secure</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-8">
            &copy; {new Date().getFullYear()} System Protocol Information Sdn Bhd. <br /> All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
