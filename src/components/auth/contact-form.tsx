"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
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
          <Input id="firstName" required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" required />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select>
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
        <Textarea id="message" rows={5} required />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}