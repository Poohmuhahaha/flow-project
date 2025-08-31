import { APIDocumentation } from "@/components/api/api-documentation"
import { APIPlayground } from "@/components/api/api-playground"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface APIDocPageProps {
  params: {
    id: string
  }
}

export default function APIDocPage({ params }: APIDocPageProps) {
  // Simulate user subscription status
  const userSubscription = "starter"
  const hasAPIAccess = userSubscription !== "starter"

  // Mock API data - in real app this would be fetched
  const apiData = {
    id: params.id,
    name: "Route Optimization API",
    description: "Calculate optimal routes for delivery, logistics, and transportation planning",
    version: "v2.1",
    baseUrl: "https://api.flow.com/v2",
    requiredPlan: "professional",
  }

  if (!hasAPIAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">API Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              You need a Professional or Enterprise subscription to access API documentation and testing tools.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Upgrade to Professional
              </button>
              <button className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="playground">API Playground</TabsTrigger>
          </TabsList>
          <TabsContent value="documentation">
            <APIDocumentation api={apiData} />
          </TabsContent>
          <TabsContent value="playground">
            <APIPlayground />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
