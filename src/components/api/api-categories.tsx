"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function APICategories() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All APIs", count: 24 },
    { id: "routing", name: "Route Optimization", count: 8 },
    { id: "analytics", name: "Analytics & Insights", count: 6 },
    { id: "geospatial", name: "Geospatial Data", count: 5 },
    { id: "traffic", name: "Traffic Management", count: 3 },
    { id: "prediction", name: "Predictive Models", count: 2 },
  ]

  const apiTypes = [
    { name: "REST APIs", count: 18 },
    { name: "GraphQL", count: 4 },
    { name: "WebSocket", count: 2 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                selectedCategory === category.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="text-sm font-medium">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{type.name}</span>
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            New to our APIs? Start with our comprehensive guides and examples.
          </p>
          <Button variant="outline" className="w-full bg-transparent" disabled>
            View Getting Started
            <Badge variant="secondary" className="ml-2 text-xs">
              Pro Required
            </Badge>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
