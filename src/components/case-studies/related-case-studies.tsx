import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

export function RelatedCaseStudies() {
  const relatedCaseStudies = [
    {
      id: "boston-walkability",
      title: "Boston Increases Pedestrian Activity by 45%",
      company: "City of Boston",
      industry: "Urban Planning",
      readTime: "11 min read",
      summary: "How Boston redesigned neighborhoods using walkability analysis to boost local business and safety.",
    },
    {
      id: "nyc-traffic-management",
      title: "NYC DOT Improves Traffic Flow by 35%",
      company: "NYC Department of Transportation",
      industry: "Government",
      readTime: "12 min read",
      summary: "New York City uses predictive analytics to optimize signal timing and reduce congestion.",
    },
    {
      id: "portland-smart-city",
      title: "Portland's Smart City Initiative Success",
      company: "City of Portland",
      industry: "Urban Planning",
      readTime: "9 min read",
      summary: "Portland leverages multiple FLO(W) solutions for comprehensive urban optimization.",
    },
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Related Case Studies</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover more success stories from organizations using FLO(W) to optimize their operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {relatedCaseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">
                {caseStudy.industry}
              </Badge>
              <CardTitle className="text-lg leading-tight">{caseStudy.title}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{caseStudy.company}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {caseStudy.readTime}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">{caseStudy.summary}</CardDescription>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/case-studies/${caseStudy.id}`}>
                  Read Case Study
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild>
          <Link href="/case-studies">
            View All Case Studies
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
