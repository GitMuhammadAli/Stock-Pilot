"use client"

import type React from "react"
import { Spinner } from "@/components/ui/spinner"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/AuthProvider"
import { isatty } from "tty"

export default function Login() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    const errorMsg = searchParams.get('error')
    if (errorMsg) {
      setMessage({ type: "error", text: decodeURIComponent(errorMsg) })
    }
  }, [searchParams])
  
  console.log(isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      console.log(isAuthenticated)
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send login link");
      }
      
      if (data.success) {
        setMessage({ 
          type: "success", 
          text: data.message || "Check your email for the login link! It will expire in 30 minutes." 
        });
        
        setEmail("");
        
        setTimeout(() => {
          router.push('/verify');
        }, 4000);
      } else {
        setMessage({ 
          type: "error", 
          text: data.message || "Failed to send login link" 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Failed to send login link. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-bg-secondary border-none shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-bg-tertiary p-3 rounded-full">
              <Mail className="h-10 w-10 text-brand-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary text-center">Login to StockPilot</CardTitle>
          <CardDescription className="text-muted text-center">
            Enter your email to receive a secure login link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-bg-tertiary border-none text-primary"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-primary text-bg-primary hover:bg-brand-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* <Loader2 className="h-4 w-4 animate-spin mr-2" /> */}
                  <Spinner size="lg" />
                  <span className="visually-hidden">Sending Link</span>
                </>
              ) : (
                "Send Login Link"
              )}
            </Button>          </form>

          {message && (
            <Alert
              className={`mt-4 ${
                message.type === "success"
                  ? "bg-bg-tertiary border-brand-primary"
                  : "bg-bg-tertiary border-status-error"
              }`}
            >
              {message.type === "error" && <AlertCircle className="h-4 w-4 text-status-error" />}
              <AlertDescription className="text-primary">{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <Separator className="bg-bg-tertiary" />

        <CardFooter className="flex justify-center pt-4">
          <p className="text-sm text-muted">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
