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
import { CreditCard, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

export function SubscriptionOverview() {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">Starter Plan</div>
              <div className="text-sm text-muted-foreground">$29/month • Data access only</div>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              Data Only
            </Badge>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>Access to basic logistics datasets</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>5,000 data points per month</span>
            </div>
            <div className="flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-muted-foreground">No API access</span>
            </div>
          </div>

          <div className="pt-4">
            <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">Upgrade to Professional</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upgrade to Professional</DialogTitle>
                  <DialogDescription>
                    Unlock API access and advanced features with our Professional plan.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-lg font-semibold mb-2">Professional Plan - $99/month</div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• All Starter features</li>
                      <li>• 50,000 API calls per month</li>
                      <li>• Real-time data streaming</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1">Upgrade Now</Button>
                    <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Billing Information
          </CardTitle>
          <CardDescription>Payment method and billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">•••• •••• •••• 4242</div>
              <div className="text-sm text-muted-foreground">Expires 12/2027</div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Next billing date</span>
            </div>
            <span className="text-sm font-medium">January 15, 2025</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Amount</span>
            <span className="text-sm font-medium">$29.00</span>
          </div>

          <Button variant="outline" className="w-full mt-4 bg-transparent">
            Manage Billing
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
