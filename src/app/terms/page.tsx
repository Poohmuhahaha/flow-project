import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted-choice py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FLO(W) Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using FLO(W) ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                FLO(W) provides logistics data and Geographic Information System (GIS) APIs to help businesses optimize their supply chain and logistics operations.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Real-time logistics data access</li>
                <li>GIS mapping and routing services</li>
                <li>Supply chain optimization tools</li>
                <li>API access for integration</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To access our services, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. API Usage and Limitations</h2>
              <p className="mb-4">
                Your use of our APIs is subject to the following terms:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>API keys are personal and should not be shared</li>
                <li>Rate limits apply to all API endpoints</li>
                <li>Usage is tracked and billed according to your plan</li>
                <li>Abuse or excessive use may result in service suspension</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Payment and Credits</h2>
              <p className="mb-4">
                Our service operates on a credit-based system:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Credits are consumed based on API usage</li>
                <li>Unused credits do not expire but are non-refundable</li>
                <li>Payment is required before credit allocation</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mb-2">
                Email: legal@flow-app.com
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link 
            href="/login" 
            className="text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
