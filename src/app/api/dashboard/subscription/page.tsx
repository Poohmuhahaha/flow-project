import { SubscriptionOverview } from "@/components/dashboard/subscription-overview"
import { BillingHistory } from "@/components/dashboard/billing-history"
import { UsageMetrics } from "@/components/dashboard/usage-metrics"

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your subscription, view usage, and billing information.</p>
      </div>

      <div className="space-y-8">
        <SubscriptionOverview />
        <UsageMetrics />
        <BillingHistory />
      </div>
    </div>
  )
}
