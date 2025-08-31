import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Route, TrendingUp, Shield, Clock, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Walkability Analysis",
      description: "Comprehensive pedestrian accessibility scoring and route optimization for urban planning.",
      badge: "Core Feature",
    },
    {
      icon: Route,
      title: "Route Optimization",
      description: "Advanced algorithms for efficient logistics routing and transportation planning.",
      badge: "Popular",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Machine learning models for demand forecasting and capacity planning.",
      badge: "AI-Powered",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data encryption.",
      badge: "Enterprise",
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Live data streams and instant API responses for time-critical applications.",
      badge: "Real-time",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user workspaces with role-based access and project management tools.",
      badge: "Collaboration",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything you need for logistics optimization
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our comprehensive platform provides all the tools and data you need to revolutionize your logistics
            operations and enhance walkability analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
