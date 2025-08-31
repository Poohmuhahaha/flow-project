import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CaseStudy {
  id: string
  title: string
  summary: string
  industry: string
  company: string
  results: string[]
  readTime: string
  publishDate: string
  featured: boolean
  solutions: string[]
  image: string
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${caseStudy.featured ? "ring-2 ring-primary/20" : ""}`}>
      {caseStudy.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-accent text-accent-foreground">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image src={caseStudy.image || "/placeholder.svg"} alt={caseStudy.title} fill className="object-cover" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {caseStudy.industry}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-xl leading-tight">{caseStudy.title}</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{caseStudy.company}</span>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {caseStudy.readTime}
            </div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">{caseStudy.summary}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Key Results:</div>
          <div className="flex flex-wrap gap-1">
            {caseStudy.results.slice(0, 2).map((result, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {result}
              </Badge>
            ))}
            {caseStudy.results.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{caseStudy.results.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Solutions Used:</div>
          <div className="flex flex-wrap gap-1">
            {caseStudy.solutions.map((solution, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {solution}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full" asChild>
          <Link href={`/case-studies/${caseStudy.id}`}>
            Read Case Study
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
