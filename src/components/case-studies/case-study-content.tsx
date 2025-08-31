import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Clock, Users } from "lucide-react"

interface CaseStudyContentProps {
  caseStudy: {
    company: string
    challenge: string
    solution: string
    results: Array<{
      metric: string
      improvement: string
      icon: string
    }>
  }
}

export function CaseStudyContent({ caseStudy }: CaseStudyContentProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return Shield
      case "trending-up":
        return TrendingUp
      case "clock":
        return Clock
      case "users":
        return Users
      default:
        return TrendingUp
    }
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">The Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{caseStudy.challenge}</p>
        </CardContent>
      </Card>

      {/* Solution Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">The Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{caseStudy.solution}</p>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Key Results</CardTitle>
          <CardDescription>Measurable impact achieved by {caseStudy.company}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.results.map((result, index) => {
              const IconComponent = getIcon(result.icon)
              return (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{result.metric}</div>
                    <div className="text-lg font-bold text-primary">{result.improvement}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Implementation Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Integration & Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Integrated existing city data with FLO(W)&apos;s walkability analysis APIs to create comprehensive
                  pedestrian traffic models and identify high-risk areas.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2">Infrastructure Planning</h4>
                <p className="text-sm text-muted-foreground">
                  Used predictive analytics to prioritize infrastructure improvements and optimize crosswalk placement
                  based on pedestrian flow patterns.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2">Implementation & Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Deployed targeted infrastructure improvements and established continuous monitoring using real-time
                  analytics to measure impact and adjust strategies.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Section */}
      <Card className="bg-muted/30">
        <CardContent className="p-8">
          <blockquote className="text-lg italic text-center text-foreground mb-4">
            FLO(W)&apos;s walkability analytics transformed how we approach urban planning. The data-driven insights allowed
            us to make targeted improvements that had immediate, measurable impact on pedestrian safety.
          </blockquote>
          <div className="text-center">
            <div className="font-semibold">Maria Rodriguez</div>
            <div className="text-sm text-muted-foreground">Director of Transportation Planning, Seattle DOT</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
