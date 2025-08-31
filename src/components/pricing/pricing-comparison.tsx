import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function PricingComparison() {
  const features = [
    {
      category: "Data Access",
      items: [
        { name: "Basic logistics datasets", starter: true, pro: true, enterprise: true },
        { name: "Premium datasets", starter: false, pro: true, enterprise: true },
        { name: "Real-time data streams", starter: false, pro: true, enterprise: true },
        { name: "Custom data sources", starter: false, pro: false, enterprise: true },
        { name: "Data export (CSV, JSON)", starter: true, pro: true, enterprise: true },
      ],
    },
    {
      category: "API Access",
      items: [
        { name: "REST API access", starter: false, pro: true, enterprise: true },
        { name: "GraphQL API", starter: false, pro: true, enterprise: true },
        { name: "Webhook notifications", starter: false, pro: true, enterprise: true },
        { name: "Custom API endpoints", starter: false, pro: false, enterprise: true },
        { name: "API rate limits", starter: "N/A", pro: "50K/month", enterprise: "Unlimited" },
      ],
    },
    {
      category: "Analytics & Insights",
      items: [
        { name: "Basic analytics dashboard", starter: true, pro: true, enterprise: true },
        { name: "Advanced analytics", starter: false, pro: true, enterprise: true },
        { name: "Custom reporting", starter: false, pro: false, enterprise: true },
        { name: "Predictive insights", starter: false, pro: true, enterprise: true },
        { name: "Data visualization tools", starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: "Support & Services",
      items: [
        { name: "Email support", starter: true, pro: true, enterprise: true },
        { name: "Priority support", starter: false, pro: true, enterprise: true },
        { name: "24/7 phone support", starter: false, pro: false, enterprise: true },
        { name: "Dedicated account manager", starter: false, pro: false, enterprise: true },
        { name: "Training & onboarding", starter: false, pro: false, enterprise: true },
      ],
    },
  ]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mx-auto" />
      )
    }
    return <span className="text-sm text-center">{value}</span>
  }

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Detailed Feature Comparison</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compare all features across our subscription plans to find the perfect fit for your logistics optimization
          needs.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="sr-only">Feature Comparison Table</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Starter</th>
                  <th className="text-center p-4 font-semibold">Professional</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={`category-${categoryIndex}`} className="bg-muted/30">
                      <td colSpan={4} className="p-4 font-semibold text-foreground">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={`item-${categoryIndex}-${itemIndex}`} className="border-b hover:bg-muted/20">
                        <td className="p-4 text-sm">{item.name}</td>
                        <td className="p-4 text-center">{renderFeatureValue(item.starter)}</td>
                        <td className="p-4 text-center">{renderFeatureValue(item.pro)}</td>
                        <td className="p-4 text-center">{renderFeatureValue(item.enterprise)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
