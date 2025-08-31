import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export function SubscriptionGate() {
  return (
    <Card className="border-accent/20 bg-accent/5 mt-8">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-accent mr-2" />
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            API Access Restricted
          </Badge>
        </div>
        <CardTitle className="text-2xl">Upgrade Required for API Access</CardTitle>
        <CardDescription className="text-base">
          You&apos;re currently on the Starter plan which includes data access only. Upgrade to Professional or Enterprise to
          unlock our powerful optimization APIs.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">Professional Plan</span>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">$99/month</div>
            <div className="text-sm text-muted-foreground mb-3">50,000 API calls included</div>
            <Button className="w-full" asChild>
              <Link href="/pricing">
                Upgrade to Pro
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">Enterprise Plan</span>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">Custom</div>
            <div className="text-sm text-muted-foreground mb-3">Unlimited API calls</div>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/pricing">Contact Sales</Link>
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <strong>What you&apos;ll get:</strong> Full API access, real-time data streaming, advanced analytics, priority
          support, and more.
        </div>
      </CardContent>
    </Card>
  )
}
