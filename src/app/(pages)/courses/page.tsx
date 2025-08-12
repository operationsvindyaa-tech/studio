
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, PlusCircle } from "lucide-react"

const courses = [
  { id: 1, title: "Bharatanatyam", instructor: "Smt. Vani Ramesh", students: 45, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "indian dance" },
  { id: 2, title: "Vocal Carnatic", instructor: "Vid. Shankar Mahadevan", students: 60, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "indian music" },
  { id: 3, title: "Guitar", instructor: "Mr. Alex Johnson", students: 75, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "guitar acoustic" },
  { id: 4, title: "Keyboard", instructor: "Mr. Richard Clayderman", students: 55, duration: "16 weeks", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "keyboard music" },
  { id: 5, title: "Piano", instructor: "Mr. Beethoven Jr.", students: 30, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "piano classic" },
  { id: 6, title: "Drums", instructor: "Mr. Ringo Starr", students: 40, duration: "10 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "drums set" },
  { id: 7, title: "Violin", instructor: "Ms. Vanessa Mae", students: 25, duration: "Ongoing", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "violin music" },
  { id: 8, title: "Western Dance", instructor: "Mr. Prabhu Deva", students: 110, duration: "8 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "hiphop dance" },
  { id: 9, title: "Zumba", instructor: "Ms. Gina Grant", students: 150, duration: "4 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "zumba fitness" },
  { id: 10, title: "Gymnastics", instructor: "Ms. Nadia Comaneci", students: 35, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "gymnastics sport" },
  { id: 11, title: "Yoga", instructor: "Yogi Adityanath", students: 200, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "yoga meditation" },
  { id: 12, title: "Karate", instructor: "Sensei Morio Higaonna", students: 90, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "karate martialarts" },
  { id: 13, title: "Kalaripayattu", instructor: "Gurukkal Meenakshi Amma", students: 50, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "kalaripayattu martialarts" },
  { id: 14, title: "Art & Craft", instructor: "Ms. Frida Kahlo", students: 120, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "art craft" },
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
                <Image src={course.image} alt={course.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={course.dataAiHint} />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">{course.level}</Badge>
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
