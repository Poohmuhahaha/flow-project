import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export function BillingHistory() {
  const invoices = [
    {
      id: "INV-2024-001",
      date: "Dec 15, 2024",
      amount: "$29.00",
      status: "paid",
      plan: "Starter Plan",
    },
    {
      id: "INV-2024-002",
      date: "Nov 15, 2024",
      amount: "$29.00",
      status: "paid",
      plan: "Starter Plan",
    },
    {
      id: "INV-2024-003",
      date: "Oct 15, 2024",
      amount: "$29.00",
      status: "paid",
      plan: "Starter Plan",
    },
    {
      id: "INV-2024-004",
      date: "Sep 15, 2024",
      amount: "$0.00",
      status: "trial",
      plan: "Free Trial",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice.date}</div>
                </div>
                <div>
                  <div className="text-sm">{invoice.plan}</div>
                  <div className="text-sm font-medium">{invoice.amount}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                  {invoice.status === "paid" ? "Paid" : "Trial"}
                </Badge>
                {invoice.status === "paid" && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
