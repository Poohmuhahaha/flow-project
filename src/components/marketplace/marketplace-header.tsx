import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export function MarketplaceHeader() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Data Marketplace</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Discover and access premium logistics datasets to power your optimization projects. All datasets are
          professionally curated and regularly updated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search datasets, categories, or keywords..." className="pl-10" />
        </div>
        <Button variant="outline" className="sm:w-auto bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  )
}
