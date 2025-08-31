import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Ready to optimize your logistics operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Join thousands of logistics professionals who trust FLO(W) for their data and optimization needs. Start your
            journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/marketplace">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 bg-transparent" asChild>
              <Link href="/case-studies">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Case Studies
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}
