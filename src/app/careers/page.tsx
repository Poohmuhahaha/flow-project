import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build scalable APIs and GIS processing systems"
    },
    {
      title: "Data Scientist",
      department: "Data Science", 
      location: "San Francisco",
      type: "Full-time",
      description: "Develop machine learning models for logistics optimization"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "New York", 
      type: "Full-time",
      description: "Lead product strategy and roadmap planning"
    }
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Help us revolutionize logistics with cutting-edge technology
          </p>
        </div>
        
        <div className="space-y-6 mb-12">
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <p className="text-muted-foreground">{job.department} • {job.location}</p>
                  </div>
                  <Badge>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{job.description}</p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented individuals. Send us your resume!
          </p>
          <Button variant="outline">Send Resume</Button>
        </div>
      </div>
    </div>
  )
}
