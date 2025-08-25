import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, PlusCircle, Wallet, CalendarDays, Edit } from "lucide-react"
import { getCourses, type Course } from "@/lib/courses-db";
import Link from "next/link"

export default async function CoursesPage() {
  const courses = await getCourses();

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
            <CardContent className="p-4 flex-grow space-y-3">
              <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground">{course.level}</Badge>
              <CardTitle className="font-headline text-lg mb-1">{course.title}</CardTitle>
              <CardDescription className="text-muted-foreground">by {course.instructor}</CardDescription>
              <div className="text-sm text-muted-foreground space-y-2 pt-2">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>{course.fees}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{course.paymentOptions}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} Students</span>
                </div>
                <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
