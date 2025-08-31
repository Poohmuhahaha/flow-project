"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, Download, Calendar, HardDrive, Globe, ShoppingCart } from "lucide-react"

interface DatasetDetailsProps {
  dataset: {
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
    lastUpdated: string
    fileSize: string
    coverage: string
    provider: string
  }
}

export function DatasetDetails({ dataset }: DatasetDetailsProps) {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{dataset.category}</Badge>
          {dataset.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{dataset.title}</h1>
        <p className="text-lg text-muted-foreground">{dataset.description}</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="font-medium">{dataset.rating}</span>
            <span className="text-muted-foreground">({dataset.reviews} reviews)</span>
          </div>
          <div className="text-muted-foreground">by {dataset.provider}</div>
        </div>
      </div>

      {/* Purchase Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">${dataset.price}</CardTitle>
              <CardDescription>One-time purchase • Lifetime access</CardDescription>
            </div>
            <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Purchase Dataset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Purchase Dataset</DialogTitle>
                  <DialogDescription>Complete your purchase to get instant access to this dataset.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-semibold mb-2">{dataset.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">{dataset.dataPoints} data points</div>
                    <div className="text-lg font-bold text-primary">${dataset.price}</div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1">Complete Purchase</Button>
                    <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{dataset.dataPoints} data points</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Updated {dataset.updateFrequency}</span>
            </div>
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{dataset.fileSize}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{dataset.coverage}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="sample">Sample</TabsTrigger>
          <TabsTrigger value="documentation">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What&apos;s Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Walkability scores for 500+ cities worldwide</li>
                  <li>• Pedestrian infrastructure density metrics</li>
                  <li>• Accessibility ratings for public facilities</li>
                  <li>• Street connectivity and network analysis</li>
                  <li>• Public transportation integration scores</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Use Cases</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Urban planning and development</li>
                  <li>• Real estate market analysis</li>
                  <li>• Public health research</li>
                  <li>• Transportation optimization</li>
                  <li>• Smart city initiatives</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Available Formats</h4>
                <div className="flex space-x-2">
                  {dataset.format.map((format, index) => (
                    <Badge key={index} variant="outline">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Data Schema</CardTitle>
              <CardDescription>Structure and fields available in this dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>city_id: string</div>
                    <div>city_name: string</div>
                    <div>country: string</div>
                    <div>walkability_score: float (0-100)</div>
                    <div>pedestrian_infrastructure: object</div>
                    <div>accessibility_rating: float (0-10)</div>
                    <div>street_connectivity: float</div>
                    <div>transit_integration: float</div>
                    <div>last_updated: datetime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample">
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>Preview of the actual data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "city_id": "NYC_001",
  "city_name": "New York City",
  "country": "United States",
  "walkability_score": 87.5,
  "pedestrian_infrastructure": {
    "sidewalk_coverage": 0.95,
    "crosswalk_density": 12.3,
    "pedestrian_signals": 1847
  },
  "accessibility_rating": 8.2,
  "street_connectivity": 0.89,
  "transit_integration": 9.1,
  "last_updated": "2024-12-01T00:00:00Z"
}`}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Detailed information about data collection and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Collection Methodology</h4>
                <p className="text-sm text-muted-foreground">
                  This dataset is compiled from multiple authoritative sources including municipal planning departments,
                  OpenStreetMap, and proprietary pedestrian traffic analysis. Data is validated through ground-truth
                  verification and updated monthly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">License & Usage Rights</h4>
                <p className="text-sm text-muted-foreground">
                  Commercial use permitted. Attribution required. Redistribution allowed with proper licensing. Suitable
                  for research, commercial applications, and derivative works.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-sm text-muted-foreground">
                  Technical support included with purchase. Documentation updates and schema changes are communicated
                  via email. Priority support available for enterprise customers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
