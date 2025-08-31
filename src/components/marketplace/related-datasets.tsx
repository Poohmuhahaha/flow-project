import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Eye } from "lucide-react"
import Link from "next/link"

export function RelatedDatasets() {
  const relatedDatasets = [
    {
      id: "2",
      title: "Public Transit Performance",
      category: "Public Transit",
      price: 179,
      rating: 4.6,
      reviews: 15,
    },
    {
      id: "4",
      title: "Urban Planning Metrics",
      category: "Urban Planning",
      price: 229,
      rating: 4.7,
      reviews: 12,
    },
    {
      id: "7",
      title: "Pedestrian Traffic Patterns",
      category: "Traffic Patterns",
      price: 199,
      rating: 4.5,
      reviews: 18,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Related Datasets</CardTitle>
          <CardDescription>Other datasets you might find useful</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedDatasets.map((dataset) => (
            <div key={dataset.id} className="space-y-3 p-4 border rounded-lg">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {dataset.category}
                </Badge>
                <h4 className="font-medium text-sm leading-tight">{dataset.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-primary">${dataset.price}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs">{dataset.rating}</span>
                    <span className="text-xs text-muted-foreground">({dataset.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent" asChild>
                  <Link href={`/marketplace/dataset/${dataset.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Have questions about this dataset or need custom data solutions?
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
