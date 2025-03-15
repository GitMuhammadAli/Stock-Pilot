"use client"

import type React from "react"

import { useState , useEffect} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name , email }),
          });
      
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to register. Please try again.");
          }
      
      setMessage({ type: "success", text: "Registration successful! Please Login." })
      setTimeout(() => {
        router.push('/login')
      }, 4000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to register. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary p-4">
      <Card className="w-full max-w-md bg-bg-secondary border-none shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-bg-tertiary p-3 rounded-full">
              <User className="h-10 w-10 text-brand-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary text-center">Create an Account</CardTitle>
          <CardDescription className="text-muted text-center">
            Enter your details to register for StockPilot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 bg-bg-tertiary border-none text-primary"
                />
              </div>
            </div>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

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
            Already have an account?{" "}
            <Link href="/login" className="text-brand-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
