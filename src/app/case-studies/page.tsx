import { CaseStudiesHeader } from "@/components/case-studies/case-studies-header"
import { CaseStudiesGrid } from "@/components/case-studies/case-studies-grid"
import { CaseStudiesFilters } from "@/components/case-studies/case-studies-filters"
import { FeaturedCaseStudy } from "@/components/case-studies/featured-case-study"

export default function CaseStudiesPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* <CaseStudiesHeader /> */}
        {/* <FeaturedCaseStudy /> */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          <div className="lg:col-span-1">
            <CaseStudiesFilters />
          </div>
          <div className="lg:col-span-3">
            <CaseStudiesGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
