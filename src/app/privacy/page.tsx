export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information. Contact us at privacy@flow-logistics.com for assistance.</p>
        
        <h2>6. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@flow-logistics.com</p>
      </div>
    </div>
  )
}
