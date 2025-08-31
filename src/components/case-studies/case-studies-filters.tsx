"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CaseStudiesFilters() {
  

  const industries = [
    { name: "Urban Planning", count: 8 },
    { name: "Logistics & Delivery", count: 12 },
    { name: "Public Transportation", count: 6 },
    { name: "Retail & E-commerce", count: 9 },
    { name: "Healthcare", count: 4 },
    { name: "Government", count: 7 },
    { name: "Real Estate", count: 5 },
    { name: "Manufacturing", count: 3 },
  ]

  const solutions = [
    { name: "Route Optimization", count: 15 },
    { name: "Walkability Analysis", count: 8 },
    { name: "Traffic Management", count: 6 },
    { name: "Fleet Management", count: 10 },
    { name: "Supply Chain", count: 7 },
    { name: "Predictive Analytics", count: 4 },
  ]

  const results = [
    { name: "Cost Reduction", count: 18 },
    { name: "Efficiency Improvement", count: 22 },
    { name: "Safety Enhancement", count: 9 },
    { name: "Customer Satisfaction", count: 14 },
    { name: "Environmental Impact", count: 6 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {industries.map((industry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`industry-${index}`} />
                <label htmlFor={`industry-${index}`} className="text-sm cursor-pointer">
                  {industry.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {industry.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Solutions Used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {solutions.map((solution, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`solution-${index}`} />
                <label htmlFor={`solution-${index}`} className="text-sm cursor-pointer">
                  {solution.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {solution.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox className="bg-ring" id={`result-${index}`} />
                <label htmlFor={`result-${index}`} className="text-sm cursor-pointer">
                  {result.name}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {result.count}
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
