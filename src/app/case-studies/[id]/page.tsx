import { CaseStudyContent } from "@/components/case-studies/case-study-content"
import { CaseStudyHeader } from "@/components/case-studies/case-study-header"
import { RelatedCaseStudies } from "@/components/case-studies/related-case-studies"

interface CaseStudyPageProps {
  params: {
    id: string
  }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  // Mock data - in real app this would be fetched based on ID
  const caseStudy = {
    id: params.id,
    title: "How Seattle Improved Pedestrian Safety by 40% Using Walkability Analytics",
    company: "Seattle Department of Transportation",
    industry: "Urban Planning",
    publishDate: "2024-11-20",
    readTime: "12 min read",
    author: "Sarah Chen, Urban Planning Analyst",
    summary:
      "Seattle Department of Transportation leveraged FLO(W)'s walkability analysis APIs to identify high-risk pedestrian areas and implement targeted infrastructure improvements.",
    challenge:
      "Seattle faced increasing pedestrian accidents in downtown areas, with limited data to identify the root causes and prioritize infrastructure investments effectively.",
    solution:
      "The city implemented FLO(W)'s walkability analysis APIs to analyze pedestrian traffic patterns, identify high-risk intersections, and optimize crosswalk placement and timing.",
    results: [
      { metric: "Pedestrian Safety", improvement: "40% reduction in accidents", icon: "shield" },
      { metric: "Infrastructure ROI", improvement: "300% return on investment", icon: "trending-up" },
      { metric: "Implementation Time", improvement: "6 months vs 2 years traditional", icon: "clock" },
      { metric: "Citizen Satisfaction", improvement: "85% approval rating", icon: "users" },
    ],
    image: "/seattle-pedestrian-walkability-infrastructure.png",
    solutions: ["Walkability Analysis", "Predictive Analytics", "Urban Planning"],
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <CaseStudyHeader caseStudy={caseStudy} />
          <CaseStudyContent caseStudy={caseStudy} />
        </div>
        <div className="mt-16">
          <RelatedCaseStudies />
        </div>
      </div>
    </div>
  )
}
