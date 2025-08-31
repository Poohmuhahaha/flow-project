import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database, Download, BarChart3 } from "lucide-react"

export function UsageMetrics() {
  const metrics = [
    {
      title: "Data Downloads",
      current: 24,
      limit: 100,
      unit: "downloads",
      icon: Download,
      description: "Monthly data download usage",
    },
    {
      title: "Data Points",
      current: 1250,
      limit: 5000,
      unit: "points",
      icon: Database,
      description: "Data points accessed this month",
    },
    {
      title: "API Calls",
      current: 0,
      limit: 0,
      unit: "calls",
      icon: BarChart3,
      description: "API access requires Professional plan",
      disabled: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>Your current month usage across all services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className={`space-y-3 ${metric.disabled ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                {!metric.disabled && (
                  <span className="text-sm text-muted-foreground">
                    {metric.current} / {metric.limit}
                  </span>
                )}
              </div>

              {!metric.disabled ? (
                <Progress value={(metric.current / metric.limit) * 100} className="h-2" />
              ) : (
                <div className="h-2 bg-muted rounded-full" />
              )}

              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
