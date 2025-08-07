import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, BarChart, PlusCircle } from "lucide-react"

const courses = [
  { id: 1, title: "Introduction to Web Development", instructor: "Dr. Evelyn Reed", students: 128, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "technology code" },
  { id: 2, title: "Advanced Data Science with Python", instructor: "Prof. Samuel Jones", students: 76, duration: "16 weeks", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "data chart" },
  { id: 3, title: "Digital Marketing Fundamentals", instructor: "Maria Garcia", students: 210, duration: "8 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "marketing social" },
  { id: 4, title: "Graphic Design Masterclass", instructor: "Leo Chen", students: 95, duration: "10 weeks", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "design art" },
  { id: 5, title: "Project Management Professionals (PMP)", instructor: "Dr. Alan Grant", students: 150, duration: "6 weeks", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "business team" },
  { id: 6, title: "The Science of Well-being", instructor: "Dr. Ellie Sattler", students: 300, duration: "4 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "nature meditation" },
]

export default function CoursesPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input placeholder="Search courses..." />
        </div>
        <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Course
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
                <Image src={course.image} alt={course.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={course.dataAiHint} />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Badge variant="secondary" className="mb-2 bg-accent/50 text-accent-foreground">{course.level}</Badge>
              <CardTitle className="font-headline text-lg mb-1">{course.title}</CardTitle>
              <CardDescription className="text-muted-foreground">by {course.instructor}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                </div>
                <Button size="sm" variant="outline">
                    View Course
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
