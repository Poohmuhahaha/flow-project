import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface APIDocumentationProps {
  api: {
    id: string
    name: string
    description: string
    version: string
    baseUrl: string
    requiredPlan: string
  }
}

export function APIDocumentation({ api }: APIDocumentationProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">API Documentation</Badge>
          <Badge variant="outline">{api.version}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{api.name}</h1>
        <p className="text-lg text-muted-foreground">{api.description}</p>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="text-sm font-medium mb-1">Base URL</div>
          <code className="text-sm bg-background px-2 py-1 rounded border">{api.baseUrl}</code>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn how to authenticate and make your first API call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  All API requests require authentication using your API key in the Authorization header:
                </p>
                <div className="bg-muted/30 p-3 rounded-lg font-mono text-sm">Authorization: Bearer YOUR_API_KEY</div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rate Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Professional: 1,000 requests per hour • Enterprise: Unlimited
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>Complete list of API endpoints and their usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">GET</Badge>
                    <code className="text-sm">/routes/optimize</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Calculate optimal route between multiple points</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                    <code className="text-sm">/routes/batch</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Process multiple route optimization requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Sample code in popular programming languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">cURL Example</div>
                <pre className="text-sm overflow-x-auto">
                  {`curl -X GET "${api.baseUrl}/routes/optimize" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": {"lat": 40.7128, "lng": -74.0060},
    "destination": {"lat": 40.7589, "lng": -73.9851},
    "waypoints": [
      {"lat": 40.7505, "lng": -73.9934}
    ]
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Official SDKs</CardTitle>
              <CardDescription>Use our official libraries for faster integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                  <code className="text-sm bg-background px-2 py-1 rounded">npm install @flow/api-client</code>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Python</h4>
                  <code className="text-sm bg-background px-2 py-1 rounded">pip install flow-api-client</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
