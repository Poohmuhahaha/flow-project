import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I get started with the API?",
      answer: "Sign up for an account, choose a plan, and generate your API key from the dashboard. Then follow our Quick Start guide in the documentation."
    },
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used to track API usage. Each API call consumes a certain number of credits based on the complexity of the operation."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time from your dashboard. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades."
    },
    {
      question: "What file formats are supported?",
      answer: "We support GeoJSON, Shapefile, KML, and CSV formats for geospatial data uploads."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team via email at support@flow-logistics.com or through the chat widget in your dashboard."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and get help with your account
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Complete API reference and guides</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Docs</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Step-by-step video guides</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Watch Videos</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get personalized help</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Contact Us</Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
