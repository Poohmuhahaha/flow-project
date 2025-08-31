import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar } from "lucide-react"
import Image from "next/image"

interface CaseStudyHeaderProps {
  caseStudy: {
    title: string
    company: string
    industry: string
    publishDate: string
    readTime: string
    author: string
    summary: string
    image: string
    solutions: string[]
  }
}

export function CaseStudyHeader({ caseStudy }: CaseStudyHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Badge variant="secondary">{caseStudy.industry}</Badge>
        <h1 className="text-4xl font-bold text-foreground text-balance">{caseStudy.title}</h1>
        <p className="text-xl text-muted-foreground text-pretty">{caseStudy.summary}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {caseStudy.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(caseStudy.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {caseStudy.readTime}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {caseStudy.solutions.map((solution, index) => (
            <Badge key={index} variant="outline">
              {solution}
            </Badge>
          ))}
        </div>
      </div>

      <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
        <Image src={caseStudy.image || "/placeholder.svg"} alt={caseStudy.title} fill className="object-cover" />
      </div>
    </div>
  )
}
