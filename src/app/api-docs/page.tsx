import { APIMarketplaceHeader } from "@/components/api/api-marketplace-header"
import { APICategories } from "@/components/api/api-categories"
import { APIGrid } from "@/components/api/api-grid"
import { SubscriptionGate } from "@/components/api/subscription-gate"

export default function APIDocsPage() {
  // Simulate user subscription status - in real app this would come from auth context
  const userSubscription = "starter" // "starter" | "professional" | "enterprise"
  const hasAPIAccess = userSubscription !== "starter"

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <APIMarketplaceHeader />

        {!hasAPIAccess && <SubscriptionGate />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <APICategories />
          </div>
          <div className="lg:col-span-3">
            <APIGrid hasAccess={hasAPIAccess} userSubscription={userSubscription} />
          </div>
        </div>
      </div>
    </div>
  )
}
