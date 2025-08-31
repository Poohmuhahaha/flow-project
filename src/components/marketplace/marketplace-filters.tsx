"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 500])

  const categories = [
    { name: "Route Optimization", count: 24 },
    { name: "Traffic Patterns", count: 18 },
    { name: "Walkability Scores", count: 15 },
    { name: "Public Transit", count: 12 },
    { name: "Delivery Networks", count: 21 },
    { name: "Urban Planning", count: 9 },
    { name: "Supply Chain", count: 16 },
    { name: "Fleet Management", count: 13 },
  ]

  const dataTypes = [
    { name: "Real-time", count: 45 },
    { name: "Historical", count: 78 },
    { name: "Predictive", count: 32 },
    { name: "Geospatial", count: 56 },
  ]

  const updateFrequency = [
    { name: "Real-time", count: 12 },
    { name: "Hourly", count: 28 },
    { name: "Daily", count: 65 },
    { name: "Weekly", count: 34 },
    { name: "Monthly", count: 11 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`category-${index}`} />
                <label htmlFor={`category-${index}`} className="text-sm cursor-pointer">
                  {category.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground-choice">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dataTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`type-${index}`} />
                <label htmlFor={`type-${index}`} className="text-sm cursor-pointer">
                  {type.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Frequency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {updateFrequency.map((freq, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`freq-${index}`} />
                <label htmlFor={`freq-${index}`} className="text-sm cursor-pointer">
                  {freq.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {freq.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )
}
