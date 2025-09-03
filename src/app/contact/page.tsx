import { ContactForm } from "@/components/contact/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team for support, sales, or partnerships
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <ContactForm />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <p>sales@flow-logistics.com</p>
                <p>+1 (555) 123-4567</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>support@flow-logistics.com</p>
                <p>Available 24/7</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p>partners@flow-logistics.com</p>
                <p>Business development opportunities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
