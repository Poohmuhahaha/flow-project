export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using FLO(W), you accept and agree to be bound by the terms of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of FLO(W) services per account for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. API Usage</h2>
        <p>API usage is subject to rate limits and fair use policies as outlined in your subscription plan.</p>
        
        <h2>4. Privacy</h2>
        <p>Your privacy is protected according to our Privacy Policy.</p>
        
        <h2>5. Contact</h2>
        <p>Questions about the Terms of Service should be sent to legal@flow-logistics.com</p>
      </div>
    </div>
  )
}
