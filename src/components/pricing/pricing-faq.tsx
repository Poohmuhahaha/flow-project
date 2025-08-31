import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFAQ() {
  const faqs = [
    {
      question: "What's the difference between data access and API access?",
      answer:
        "Data access allows you to download and export logistics datasets in standard formats like CSV and JSON. API access provides real-time programmatic access to our optimization algorithms and allows you to integrate our services directly into your applications. Starter plan includes data access only, while Professional and Enterprise plans include both data and API access.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your subscription at any time. When upgrading, you'll have immediate access to new features. When downgrading, changes take effect at the next billing cycle, and you'll retain access to premium features until then.",
    },
    {
      question: "What happens if I exceed my API limits?",
      answer:
        "If you exceed your monthly API limits, your requests will be temporarily throttled. You can either wait for the next billing cycle or upgrade to a higher plan for increased limits. Enterprise customers have unlimited API access.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we offer a 14-day free trial for all plans. During the trial, you'll have full access to your chosen plan's features. No credit card is required to start your trial.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "All plans include email support. Professional plans get priority support with faster response times. Enterprise customers receive 24/7 phone support and a dedicated account manager for personalized assistance.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no cancellation fees or long-term contracts. You'll continue to have access to your plan's features until the end of your current billing period.",
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer:
        "Our Enterprise plan is fully customizable to meet your specific logistics optimization needs. This includes custom integrations, white-label options, dedicated infrastructure, and tailored SLAs. Contact our sales team to discuss your requirements.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers. All payments are processed securely and we're PCI DSS compliant.",
    },
  ]

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about our pricing or features? Find answers to the most common questions below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
