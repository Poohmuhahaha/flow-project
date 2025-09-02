"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" }, 
    // { href: "/api-docs", label: "API Docs" },
    { href: "/case-studies", label: "Case Studies" },
    // { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          <Image
            src="/FLOW_logo_3.png"
            alt="FLO(W) logo"
            width={40}
            height={40}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">FLO(W)</span>
          <span className="text-xs text-muted-foreground hidden sm:block">Future Logistics & Optimization</span>
        </div>
      </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api/auth/login/interface">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button size="sm" asChild>  
            <Link href="/api/auth/register/interface">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link href="/api/auth/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link href="/api/auth/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
