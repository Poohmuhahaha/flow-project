import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BookOpen } from "lucide-react"

export function CaseStudiesHeader() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-foreground text-balance">Case Studies</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Discover how leading organizations use FLO(W) to optimize their logistics operations, improve walkability, and
          drive measurable business results.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search case studies, industries, or solutions..." className="pl-10" />
        </div>
        <Button variant="outline" className="sm:w-auto bg-transparent">
          All Categories
        </Button>
      </div>
    </div>
  )
}
