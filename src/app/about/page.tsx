export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About FLO(W)</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            FLO(W) is a comprehensive logistics optimization platform that combines advanced 
            geospatial analytics with machine learning to revolutionize supply chain management.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            To empower businesses with data-driven insights that optimize logistics operations, 
            reduce costs, and improve efficiency across the entire supply chain.
          </p>
          
          <h2>What We Do</h2>
          <ul>
            <li>Route optimization and planning</li>
            <li>Geospatial data analysis</li>
            <li>Traffic pattern prediction</li>
            <li>Walkability and accessibility analytics</li>
            <li>Supply chain optimization</li>
          </ul>
          
          <h2>Our Technology</h2>
          <p>
            Built on cutting-edge GIS processing capabilities, our platform processes millions 
            of data points to deliver real-time insights and predictive analytics.
          </p>
        </div>
      </div>
    </div>
  )
}
