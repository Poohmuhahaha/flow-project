import { DatasetCard } from "./dataset-card"

export function DatasetGrid() {
  const datasets = [
    {
      id: "1",
      title: "Global Urban Walkability Index",
      description: "Comprehensive walkability scores for 500+ cities worldwide with pedestrian infrastructure data",
      category: "Walkability Scores",
      price: 149,
      dataPoints: "2.5M",
      updateFrequency: "Monthly",
      format: ["CSV", "JSON", "GeoJSON"],
      rating: 4.8,
      reviews: 24,
      featured: true,
      tags: ["Urban Planning", "Pedestrian", "Infrastructure"],
    },
    {
      id: "2",
      title: "Real-time Traffic Flow Dataset",
      description: "Live traffic patterns and congestion data from major metropolitan areas",
      category: "Traffic Patterns",
      price: 299,
      dataPoints: "10M",
      updateFrequency: "Real-time",
      format: ["JSON", "XML"],
      rating: 4.9,
      reviews: 18,
      featured: false,
      tags: ["Real-time", "Traffic", "Congestion"],
    },
    {
      id: "3",
      title: "Last-Mile Delivery Routes",
      description: "Optimized delivery route data for urban and suburban areas across North America",
      category: "Delivery Networks",
      price: 199,
      dataPoints: "1.8M",
      updateFrequency: "Daily",
      format: ["CSV", "JSON"],
      rating: 4.7,
      reviews: 31,
      featured: false,
      tags: ["Delivery", "Routes", "Optimization"],
    },
    {
      id: "4",
      title: "Public Transit Performance",
      description: "Comprehensive public transportation data including schedules, delays, and ridership",
      category: "Public Transit",
      price: 179,
      dataPoints: "3.2M",
      updateFrequency: "Hourly",
      format: ["CSV", "JSON", "GTFS"],
      rating: 4.6,
      reviews: 15,
      featured: true,
      tags: ["Transit", "Schedules", "Performance"],
    },
    {
      id: "5",
      title: "Supply Chain Network Analysis",
      description: "Global supply chain routes and logistics hub data with performance metrics",
      category: "Supply Chain",
      price: 399,
      dataPoints: "5.1M",
      updateFrequency: "Weekly",
      format: ["CSV", "JSON", "XML"],
      rating: 4.8,
      reviews: 22,
      featured: false,
      tags: ["Supply Chain", "Logistics", "Global"],
    },
    {
      id: "6",
      title: "Fleet Management Insights",
      description: "Vehicle tracking and fleet optimization data from commercial transportation companies",
      category: "Fleet Management",
      price: 249,
      dataPoints: "4.3M",
      updateFrequency: "Daily",
      format: ["CSV", "JSON"],
      rating: 4.5,
      reviews: 19,
      featured: false,
      tags: ["Fleet", "Vehicles", "Tracking"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available Datasets</h2>
          <p className="text-muted-foreground">Showing 150 datasets</p>
        </div>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option>Sort by: Relevance</option>
          <option>Sort by: Price (Low to High)</option>
          <option>Sort by: Price (High to Low)</option>
          <option>Sort by: Rating</option>
          <option>Sort by: Most Recent</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {datasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
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
            3
          </button>
          <button className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
            Next
          </button>
        </div>
      </div> */}
    </div>
  )
}
