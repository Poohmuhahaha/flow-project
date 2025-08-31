import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Eye, Database } from "lucide-react"
import Link from "next/link"

interface Dataset {
  id: string
  title: string
  description: string
  category: string
  price: number
  dataPoints: string
  updateFrequency: string
  format: string[]
  rating: number
  reviews: number
  featured: boolean
  tags: string[]
}

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card className={`relative hover:shadow-lg transition-shadow ${dataset.featured ? "ring-2 ring-primary/20" : ""}`}>
      {dataset.featured && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              {dataset.category}
            </Badge>
            <CardTitle className="text-xl leading-tight">{dataset.title}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${dataset.price}</div>
            <div className="text-xs text-muted-foreground">one-time</div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">{dataset.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Database className="h-4 w-4 mr-2 text-muted-foreground-choice" />
            <span>{dataset.dataPoints} points</span>
          </div>
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-2 text-muted-foreground-choice" />
            <span>{dataset.updateFrequency}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{dataset.rating}</span>
            <span className="text-sm text-muted-foreground">({dataset.reviews})</span>
          </div>
          <div className="flex items-center space-x-1">
            {dataset.format.map((format, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-primary text-muted-foreground-choice">
                {format}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {dataset.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/marketplace/dataset/${dataset.id}`}>
              <Download className="h-4 w-4 mr-2" />
              Purchase
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/marketplace/dataset/${dataset.id}`}>
              <Eye className="text-primary h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
