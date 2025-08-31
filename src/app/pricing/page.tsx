import { PricingPlans } from "@/components/pricing/pricing-plans"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { PricingComparison } from "@/components/pricing/pricing-comparison"

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Choose the perfect plan for your logistics needs
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Start with data access and scale up to unlock powerful APIs as your optimization requirements grow. All
            plans include our core logistics datasets and premium support.
          </p>
        </div>

        {/* Pricing Plans */}
        <PricingPlans />

        {/* Feature Comparison */}
        <PricingComparison />

        {/* FAQ */}
        <PricingFAQ />

        {/* Enterprise CTA */}
        <div className="mt-20 text-center bg-muted/30 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need a custom solution?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our Enterprise plan offers unlimited API access, custom integrations, dedicated support, and white-label
            options tailored to your specific logistics optimization needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Contact Sales
            </button>
            <button className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
