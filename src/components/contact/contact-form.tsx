"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Loader2 } from "lucide-react"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitted(true)
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  if (submitted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-600">We'll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required 
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required 
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleInputChange}
          required 
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select onValueChange={handleSelectChange} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Inquiry</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          name="message"
          rows={5} 
          value={formData.message}
          onChange={handleInputChange}
          required 
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
