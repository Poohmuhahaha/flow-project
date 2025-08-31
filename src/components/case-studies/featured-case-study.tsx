import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"

export function FeaturedCaseStudy() {
  return (
    <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-accent text-accent-foreground">Featured Case Study</Badge>
          <Badge variant="secondary">Urban Planning</Badge>
        </div>
        <CardTitle className="text-2xl">
          How Seattle Improved Pedestrian Safety by 40% Using Walkability Analytics
        </CardTitle>
        <CardDescription className="text-base">
          Seattle Department of Transportation leveraged FLO(W)&apos;s walkability analysis APIs to identify high-risk
          pedestrian areas and implement targeted infrastructure improvements, resulting in significant safety
          improvements and increased foot traffic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-primary">40%</div>
              <div className="text-sm text-muted-foreground-choice">Safety Improvement</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-primary">6 Months</div>
              <div className="text-sm text-muted-foreground-choice">Implementation</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-primary">750K</div>
              <div className="text-sm text-muted-foreground-choice">Citizens Impacted</div>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href="/case-studies/seattle-walkability">
            Read Full Case Study
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
