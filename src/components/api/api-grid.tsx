import { APICard } from "./api-card"

interface APIGridProps {
  hasAccess: boolean
  userSubscription: string
}

export function APIGrid({ hasAccess, userSubscription }: APIGridProps) {
  const apis = [
    {
      id: "route-optimization",
      name: "Route Optimization API",
      description: "Calculate optimal routes for delivery, logistics, and transportation planning",
      category: "Route Optimization",
      version: "v2.1",
      methods: ["GET", "POST"],
      endpoints: 8,
      rateLimit: "1000/hour",
      complexity: "Medium",
      popular: true,
      requiredPlan: "professional",
    },
    {
      id: "walkability-analysis",
      name: "Walkability Analysis API",
      description: "Analyze pedestrian accessibility and walkability scores for any location",
      category: "Analytics & Insights",
      version: "v1.3",
      methods: ["GET", "POST"],
      endpoints: 5,
      rateLimit: "500/hour",
      complexity: "Easy",
      popular: true,
      requiredPlan: "professional",
    },
    {
      id: "traffic-prediction",
      name: "Traffic Prediction API",
      description: "Real-time traffic forecasting and congestion prediction models",
      category: "Predictive Models",
      version: "v1.0",
      methods: ["GET", "POST", "WebSocket"],
      endpoints: 12,
      rateLimit: "2000/hour",
      complexity: "Advanced",
      popular: false,
      requiredPlan: "enterprise",
    },
    {
      id: "geospatial-data",
      name: "Geospatial Data API",
      description: "Access comprehensive geospatial datasets and mapping services",
      category: "Geospatial Data",
      version: "v2.0",
      methods: ["GET", "POST"],
      endpoints: 15,
      rateLimit: "1500/hour",
      complexity: "Medium",
      popular: true,
      requiredPlan: "professional",
    },
    {
      id: "fleet-optimization",
      name: "Fleet Optimization API",
      description: "Optimize fleet operations, vehicle routing, and resource allocation",
      category: "Route Optimization",
      version: "v1.8",
      methods: ["GET", "POST", "PUT"],
      endpoints: 10,
      rateLimit: "800/hour",
      complexity: "Advanced",
      popular: false,
      requiredPlan: "professional",
    },
    {
      id: "supply-chain-analytics",
      name: "Supply Chain Analytics API",
      description: "Advanced analytics for supply chain optimization and performance monitoring",
      category: "Analytics & Insights",
      version: "v1.5",
      methods: ["GET", "POST"],
      endpoints: 7,
      rateLimit: "600/hour",
      complexity: "Medium",
      popular: true,
      requiredPlan: "enterprise",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available APIs</h2>
          <p className="text-muted-foreground">
            {hasAccess ? "Choose from our comprehensive API collection" : "Upgrade to access these powerful APIs"}
          </p>
        </div>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option>Sort by: Popularity</option>
          <option>Sort by: Name</option>
          <option>Sort by: Category</option>
          <option>Sort by: Complexity</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api) => (
          <APICard key={api.id} api={api} hasAccess={hasAccess} userSubscription={userSubscription} />
        ))}
      </div>
    </div>
  )
}
