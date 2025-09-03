"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage("If an account with that email exists, we've sent password reset instructions.")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email to receive reset instructions</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {message ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{message}</span>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
