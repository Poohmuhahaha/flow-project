import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DatasetPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
        <CardDescription>Interactive preview of the dataset</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-lg font-medium mb-2">Interactive Map Preview</div>
            <div className="text-sm">Walkability scores visualization would appear here</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
