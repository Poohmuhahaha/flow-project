"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Code, Star, Zap, ArrowRight, Eye } from "lucide-react"
import Link from "next/link"

interface API {
  id: string
  name: string
  description: string
  category: string
  version: string
  methods: string[]
  endpoints: number
  rateLimit: string
  complexity: string
  popular: boolean
  requiredPlan: string
}

interface APICardProps {
  api: API
  hasAccess: boolean
  userSubscription: string
}

export function APICard({ api, hasAccess, userSubscription }: APICardProps) {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const canAccess =
    hasAccess &&
    (api.requiredPlan === "professional" || (api.requiredPlan === "enterprise" && userSubscription === "enterprise"))

  const needsUpgrade = !canAccess

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className={`relative hover:shadow-lg transition-shadow ${needsUpgrade ? "opacity-75" : ""}`}>
      {api.popular && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-accent text-accent-foreground">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      {needsUpgrade && (
        <div className="absolute top-4 left-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{api.category}</Badge>
            <Badge variant="outline" className={getComplexityColor(api.complexity)}>
              {api.complexity}
            </Badge>
          </div>
          <CardTitle className="text-xl">{api.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {api.version}
            </Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{api.endpoints} endpoints</span>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">{api.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Methods:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {api.methods.map((method, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Rate Limit:</span>
            <div className="font-medium mt-1">{api.rateLimit}</div>
          </div>
        </div>

        {needsUpgrade && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <div className="flex items-center text-sm text-accent">
              <Zap className="h-4 w-4 mr-2" />
              <span className="font-medium">
                {api.requiredPlan === "enterprise" ? "Enterprise" : "Professional"} plan required
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {canAccess ? (
            <>
              <Button size="sm" className="flex-1" asChild>
                <Link href={`/api-docs/${api.id}`}>
                  <Code className="h-4 w-4 mr-2" />
                  View Docs
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/api-docs/${api.id}/playground`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1" disabled={!hasAccess}>
                    <Lock className="h-4 w-4 mr-2" />
                    {hasAccess ? "Upgrade Required" : "Upgrade to Access"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Required</DialogTitle>
                    <DialogDescription>
                      This API requires a {api.requiredPlan === "enterprise" ? "Enterprise" : "Professional"}{" "}
                      subscription to access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="font-semibold mb-2">{api.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{api.description}</div>
                      <div className="text-sm">
                        <strong>Required:</strong> {api.requiredPlan === "enterprise" ? "Enterprise" : "Professional"}{" "}
                        Plan
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1" asChild>
                        <Link href="/pricing">
                          Upgrade Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" disabled>
                <Eye className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
