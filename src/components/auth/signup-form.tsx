"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Registration failed')
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
    if (error) setError('')
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Account Created Successfully!</h3>
          <p className="text-green-600 mb-4">
            Welcome to FLO(W)! You can now sign in with your credentials.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

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
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Enter your company name"
            value={formData.company}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role (Optional)</Label>
          <Select onValueChange={handleSelectChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logistics-manager">Logistics Manager</SelectItem>
              <SelectItem value="supply-chain">Supply Chain Analyst</SelectItem>
              <SelectItem value="data-scientist">Data Scientist</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              minLength={8}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              minLength={8}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.
        </div>

        <Button 
          type="submit"
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
