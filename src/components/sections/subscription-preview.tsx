import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export function SubscriptionPreview() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started with logistics data",
      features: [
        "Access to basic datasets", 
        "5,000 API calls/month", 
        "Email support", 
        "Basic analytics",
      ],
      dataOnly: true,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Advanced features for growing logistics operations",
      features: [
        "All Starter features",
        "Premium datasets access",
        "50,000 API calls/month",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
      ],
      badge: "Most Popular",
      dataOnly: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large-scale operations",
      features: [
        "All Professional features",
        "Unlimited API calls",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "White-label options",
      ],
      badge: "Enterprise",
      dataOnly: false,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Choose the right plan for your needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Start with data access and upgrade to unlock powerful APIs as your logistics optimization needs grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.badge === "Most Popular" ? "ring-2 ring-primary" : ""}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {plan.badge === "Most Popular" && <Star className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-primary ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                {plan.dataOnly && (
                  <Badge variant="outline" className="w-fit mx-auto bg-secondary-foreground mt-2">
                    Data Access Only
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground-choice">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full" variant="default" asChild>
                  <Link href="/pricing">
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Link>
                </Button>


              </CardContent>

            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Note:</strong> API access requires a Professional or Enterprise subscription. Starter plan includes
            data access only.
          </p>
          <Button variant="ghost" asChild>
            <Link href="/pricing">View detailed pricing comparison →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
