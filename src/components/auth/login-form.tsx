// components/auth/login-form.tsx - อัพเดท
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { email, password, rememberMe } = formData

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to dashboard on success
        router.push('/api/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('') // Clear error when user types
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit"
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
