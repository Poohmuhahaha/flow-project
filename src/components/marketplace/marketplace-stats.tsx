export function MarketplaceStats() {
  const stats = [
    { label: "Total Datasets", value: "150+" },
    { label: "Data Points", value: "10M+" },
    { label: "Categories", value: "12" },
    { label: "Updated Daily", value: "85%" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-muted/30 rounded-lg">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
