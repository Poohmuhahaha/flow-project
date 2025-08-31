import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Database, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden from-background to-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border bg-card-choice px-4 py-2 text-sm">
            <Zap className="mr-2 h-4 w-4 text-accent" />
            <span className="text-muted-foreground-choice">Revolutionizing Logistics Optimization</span>
          </div>

          {/* Hero Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
            Future Logistics &{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Optimization
            </span>{" "}
            For Walkability
          </h1>

          {/* Hero Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl text-pretty max-w-2xl mx-auto">
            Access premium logistics data and powerful APIs to optimize transportation efficiency, enhance walkability
            analysis, and drive smarter business decisions with our comprehensive platform.
          </p>

          {/* Hero Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/marketplace">
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="text-base px-8" asChild>
              <Link href="/api-docs">View API Documentation</Link>
            </Button>
          </div>

          {/* Hero Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Premium Data</h3>
              <p className="text-sm text-muted-foreground">
                Access high-quality logistics and walkability datasets from trusted sources
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Powerful APIs</h3>
              <p className="text-sm text-muted-foreground">
                Integrate advanced optimization algorithms directly into your applications
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Real-time Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get instant analytics and optimization recommendations for your logistics operations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
