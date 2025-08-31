import { CaseStudyCard } from "./case-study-card"

export function CaseStudiesGrid() {
  const caseStudies = [
    {
      id: "amazon-last-mile",
      title: "Amazon Reduces Last-Mile Delivery Costs by 25%",
      summary:
        "How Amazon optimized their delivery routes using FLO(W)'s route optimization APIs, resulting in significant cost savings and improved customer satisfaction.",
      industry: "Logistics & Delivery",
      company: "Amazon Logistics",
      results: ["25% cost reduction", "30% faster deliveries", "95% customer satisfaction"],
      readTime: "8 min read",
      publishDate: "2024-11-15",
      featured: false,
      solutions: ["Route Optimization", "Fleet Management"],
      image: "/amazon-delivery-trucks.png",
    },
    {
      id: "nyc-traffic-management",
      title: "NYC DOT Improves Traffic Flow by 35% with Predictive Analytics",
      summary:
        "New York City Department of Transportation uses FLO(W)'s traffic prediction APIs to optimize signal timing and reduce congestion across Manhattan.",
      industry: "Government",
      company: "NYC Department of Transportation",
      results: ["35% traffic improvement", "20% emission reduction", "15% travel time savings"],
      readTime: "12 min read",
      publishDate: "2024-10-28",
      featured: true,
      solutions: ["Traffic Management", "Predictive Analytics"],
      image: "/new-york-city-traffic-management.png",
    },
    {
      id: "walmart-supply-chain",
      title: "Walmart Streamlines Supply Chain with Real-time Analytics",
      summary:
        "Walmart leverages FLO(W)'s supply chain analytics to optimize inventory distribution and reduce stockouts across 4,700+ stores.",
      industry: "Retail & E-commerce",
      company: "Walmart Inc.",
      results: ["40% inventory optimization", "60% stockout reduction", "$2.1B cost savings"],
      readTime: "10 min read",
      publishDate: "2024-10-12",
      featured: false,
      solutions: ["Supply Chain", "Predictive Analytics"],
      image: "/walmart-supply-chain-warehouse.png",
    },
    {
      id: "uber-route-optimization",
      title: "Uber Enhances Driver Efficiency with Dynamic Route Planning",
      summary:
        "Uber integrates FLO(W)'s real-time route optimization to improve driver earnings and reduce passenger wait times in major metropolitan areas.",
      industry: "Public Transportation",
      company: "Uber Technologies",
      results: ["22% driver earnings increase", "18% wait time reduction", "95% route accuracy"],
      readTime: "7 min read",
      publishDate: "2024-09-30",
      featured: false,
      solutions: ["Route Optimization", "Real-time Analytics"],
      image: "/uber-rideshare-optimization.png",
    },
    {
      id: "fedex-fleet-management",
      title: "FedEx Optimizes Fleet Operations Across 220 Countries",
      summary:
        "FedEx uses FLO(W)'s fleet management APIs to optimize vehicle utilization, maintenance scheduling, and fuel efficiency globally.",
      industry: "Logistics & Delivery",
      company: "FedEx Corporation",
      results: ["30% fuel savings", "25% maintenance cost reduction", "99.5% delivery reliability"],
      readTime: "9 min read",
      publishDate: "2024-09-18",
      featured: true,
      solutions: ["Fleet Management", "Route Optimization"],
      image: "/fedex-delivery-fleet-optimization.png",
    },
    {
      id: "boston-walkability",
      title: "Boston Increases Pedestrian Activity by 45% Through Smart Planning",
      summary:
        "City of Boston uses FLO(W)'s walkability analysis to redesign neighborhoods, creating more pedestrian-friendly environments and boosting local business.",
      industry: "Urban Planning",
      company: "City of Boston",
      results: ["45% pedestrian increase", "30% local business growth", "85% resident satisfaction"],
      readTime: "11 min read",
      publishDate: "2024-08-25",
      featured: false,
      solutions: ["Walkability Analysis", "Urban Planning"],
      image: "/boston-pedestrian-walkability-planning.png",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">All Case Studies</h2>
          <p className="text-muted-foreground">Showing {caseStudies.length} success stories</p>
        </div>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option>Sort by: Most Recent</option>
          <option>Sort by: Industry</option>
          <option>Sort by: Results Impact</option>
          <option>Sort by: Company Size</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
        ))}
      </div>

      {/* <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg">1</button>
          <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
            2
          </button>
          <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
            Next
          </button>
        </div>
      </div> */}
    </div>
  )
}
