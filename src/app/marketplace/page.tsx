import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { DatasetGrid } from "@/components/marketplace/dataset-grid"
import { MarketplaceStats } from "@/components/marketplace/marketplace-stats"

export default function MarketplacePage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* <MarketplaceHeader /> */}
        {/* <MarketplaceStats /> */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <MarketplaceFilters />
          </div>
          <div className="lg:col-span-3">
            <DatasetGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
