import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play } from "lucide-react"

export function APIPlayground() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">API Playground</h2>
        <p className="text-muted-foreground">Test API endpoints directly from your browser</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>Configure your API request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Method</label>
              <Select defaultValue="GET">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Endpoint</label>
              <Select defaultValue="/routes/optimize">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/routes/optimize">/routes/optimize</SelectItem>
                  <SelectItem value="/routes/batch">/routes/batch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Request Body</label>
              <Textarea
                placeholder="Enter JSON request body..."
                className="font-mono text-sm"
                rows={8}
                defaultValue={`{
  "origin": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "destination": {
    "lat": 40.7589,
    "lng": -73.9851
  },
  "waypoints": [
    {
      "lat": 40.7505,
      "lng": -73.9934
    }
  ]
}`}
              />
            </div>
            <Button className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm min-h-[300px]">
              <div className="text-muted-foreground">Click &quot;Send Request&quot; to see the response...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
