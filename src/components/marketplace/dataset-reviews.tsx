import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function DatasetReviews() {
  const reviews = [
    {
      id: "1",
      author: "Sarah Chen",
      role: "Urban Planner",
      rating: 5,
      date: "2024-11-15",
      content:
        "Excellent dataset with comprehensive coverage. The walkability scores align perfectly with our ground-truth assessments. Regular updates make this invaluable for ongoing projects.",
    },
    {
      id: "2",
      author: "Michael Rodriguez",
      role: "Data Scientist",
      rating: 5,
      date: "2024-11-08",
      content:
        "High-quality data with consistent formatting. The GeoJSON format made integration seamless. Documentation is thorough and support team is responsive.",
    },
    {
      id: "3",
      author: "Emma Thompson",
      role: "Research Analyst",
      rating: 4,
      date: "2024-10-22",
      content:
        "Great dataset for academic research. Would love to see more granular neighborhood-level data in future updates. Overall very satisfied with the purchase.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>What others are saying about this dataset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarFallback>
                  {review.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{review.author}</div>
                    <div className="text-sm text-muted-foreground">{review.role}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.content}</p>
                <div className="text-xs text-muted-foreground">{review.date}</div>
              </div>
            </div>
            {review.id !== reviews[reviews.length - 1].id && <div className="border-t" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
