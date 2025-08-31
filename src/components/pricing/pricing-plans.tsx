"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Star, Zap } from "lucide-react"
import Link from "next/link"

export function PricingPlans() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started with logistics data",
      monthlyPrice: 29,
      annualPrice: 290,
      badge: null,
      dataOnly: true,
      features: [
        "Access to basic logistics datasets",
        "5,000 data points per month",
        "Standard data formats (CSV, JSON)",
        "Email support",
        "Basic analytics dashboard",
        "Data export capabilities",
        "Community forum access",
      ],
      limitations: ["No API access", "Limited to data downloads only"],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      description: "Advanced features for growing logistics operations",
      monthlyPrice: 99,
      annualPrice: 990,
      badge: "Most Popular",
      dataOnly: false,
      features: [
        "All Starter features",
        "Premium datasets access",
        "50,000 API calls per month",
        "Real-time data streaming",
        "Advanced analytics & insights",
        "Priority email & chat support",
        "Team collaboration tools",
        "Custom data integrations",
        "API documentation access",
        "Webhook notifications",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Tailored solutions for large-scale operations",
      monthlyPrice: null,
      annualPrice: null,
      badge: "Enterprise",
      dataOnly: false,
      features: [
        "All Professional features",
        "Unlimited API calls",
        "Custom data sources",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantee (99.9% uptime)",
        "White-label options",
        "Custom integrations",
        "Advanced security features",
        "Training & onboarding",
        "Custom reporting",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <span className={`text-sm ${isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}`}>Annual</span>
        <Badge variant="secondary" className="ml-2">
          Save 17%
        </Badge>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${plan.popular ? "ring-2 ring-primary scale-105" : ""} ${
              plan.dataOnly ? "bg-muted/20" : ""
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  {plan.badge === "Most Popular" && <Star className="w-3 h-3 mr-1" />}
                  {plan.badge === "Enterprise" && <Zap className="w-3 h-3 mr-1" />}
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center">
                {plan.monthlyPrice ? (
                  <>
                    <span className="text-4xl font-bold text-primary">
                      ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /month
                      </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-primary">Custom</span>
                )}
              </div>
              {isAnnual && plan.monthlyPrice && (
                <div className="text-sm text-muted-foreground">Billed annually (${plan.annualPrice}/year)</div>
              )}
              <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
              {plan.dataOnly && (
                <Badge variant="outline" className="w-fit mx-auto mt-2">
                  Data Access Only
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Limitations:</div>
                  <ul className="space-y-1">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild={plan.name !== "Enterprise"}
              >
                {plan.name === "Enterprise" ? <button>{plan.cta}</button> : <Link href="/auth/signup">{plan.cta}</Link>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Note */}
      <div className="text-center mt-12 p-6 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-center justify-center mb-2">
          <Zap className="h-5 w-5 text-accent mr-2" />
          <span className="font-semibold text-foreground">Important Note</span>
        </div>
        <p className="text-sm text-muted-foreground">
          <strong>API access requires a Professional or Enterprise subscription.</strong> Starter plan users can access
          and download logistics datasets but cannot use our optimization APIs. Upgrade anytime to unlock full API
          capabilities.
        </p>
      </div>
    </div>
  )
}
