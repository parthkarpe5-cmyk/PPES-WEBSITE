'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { School, ArrowRight, Lock, Mail, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating a brief network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === "admin@ppes.com" && password === "ppes") {
      toast.success("Welcome back, Admin!", {
        description: "Redirecting to your dashboard...",
      })
      router.push("/admin")
    } else {
      toast.error("Invalid Credentials", {
        description: "Please check your email and password.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1f35] px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 h-full w-full opacity-20">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-deep-blue blur-[120px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-deep-blue text-white shadow-2xl animate-float">
            <School className="h-8 w-8" />
          </div>
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-white font-display">
            Admin Portal
          </h2>
          <p className="mt-2 text-sky/80 font-medium font-display uppercase tracking-widest text-xs">
            Prarambha Path
          </p>
        </div>

        <Card className="border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-white">Sign In</CardTitle>
              <CardDescription className="text-white/60">
                Use <span className="text-sky font-medium">admin@ppes.com</span> to log in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-white/80 group-focus-within:text-sky transition-colors">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input 
                    id="email" 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ppes.com" 
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-sky/50 focus:ring-sky/20 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/80 group-focus-within:text-sky transition-colors">Password</Label>
                  <Link href="#" className="text-xs text-sky hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white focus:border-sky/50 focus:ring-sky/20 transition-all" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-sky hover:bg-sky/90 text-white shadow-lg shadow-sky/20 transition-all group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-white/30">
           &copy; {new Date().getFullYear()} Prarambha Path Evening School. <br />
           Secure Administrative Access
        </p>
      </div>
    </div>
  )
}
