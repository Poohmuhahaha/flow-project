import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Code, Key } from "lucide-react"

export function APIMarketplaceHeader() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Code className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-foreground text-balance">API Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Powerful logistics optimization APIs to integrate directly into your applications. Real-time data processing,
          route optimization, and predictive analytics at your fingertips.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search APIs, endpoints, or methods..." className="pl-10" />
        </div>
        <Button variant="outline" className="sm:w-auto bg-transparent">
          <Key className="h-4 w-4 mr-2" />
          API Keys
        </Button>
      </div>
    </div>
  )
}
