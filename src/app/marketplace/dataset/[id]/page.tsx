import { DatasetDetails } from "@/components/marketplace/dataset-details"
import { DatasetPreview } from "@/components/marketplace/dataset-preview"
import { DatasetReviews } from "@/components/marketplace/dataset-reviews"
import { RelatedDatasets } from "@/components/marketplace/related-datasets"

interface DatasetPageProps {
  params: {
    id: string
  }
}

export default function DatasetPage({ params }: DatasetPageProps) {
  // In a real app, you'd fetch the dataset by ID
  const dataset = {
    id: params.id,
    title: "Global Urban Walkability Index",
    description:
      "Comprehensive walkability scores for 500+ cities worldwide with detailed pedestrian infrastructure data, accessibility metrics, and urban planning insights.",
    category: "Walkability Scores",
    price: 149,
    dataPoints: "2.5M",
    updateFrequency: "Monthly",
    format: ["CSV", "JSON", "GeoJSON"],
    rating: 4.8,
    reviews: 24,
    featured: true,
    tags: ["Urban Planning", "Pedestrian", "Infrastructure"],
    lastUpdated: "2024-12-15",
    fileSize: "1.2 GB",
    coverage: "Global",
    provider: "Urban Analytics Corp",
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DatasetDetails dataset={dataset} />
            <DatasetPreview dataset={dataset} />
            <DatasetReviews datasetId={dataset.id} />
          </div>
          <div className="lg:col-span-1">
            <RelatedDatasets currentDatasetId={dataset.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
