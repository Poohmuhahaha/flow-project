export function StatsSection() {
  const stats = [
    {
      value: "10M+",
      label: "Data Points",
      description: "Comprehensive logistics data coverage",
    },
    {
      value: "500+",
      label: "API Endpoints",
      description: "Powerful optimization algorithms",
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service guarantee",
    },
    {
      value: "1000+",
      label: "Active Users",
      description: "Trusted by logistics professionals",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
