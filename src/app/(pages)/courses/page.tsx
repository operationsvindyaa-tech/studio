
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, PlusCircle, Wallet, CalendarDays, Edit } from "lucide-react"
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialCourses = [
  { id: 1, title: "Bharatanatyam", instructor: "Smt. Vani Ramesh", students: 45, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "bharatanatyam dance", fees: 2500, paymentOptions: "Monthly" },
  { id: 2, title: "Vocal Carnatic", instructor: "Vid. Shankar Mahadevan", students: 60, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "carnatic music", fees: 3000, paymentOptions: "Monthly" },
  { id: 3, title: "Guitar", instructor: "Mr. Alex Johnson", students: 75, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "acoustic guitar", fees: 4000, paymentOptions: "Quarterly" },
  { id: 4, title: "Keyboard", instructor: "Mr. Richard Clayderman", students: 55, duration: "16 weeks", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "music keyboard", fees: 4500, paymentOptions: "Quarterly" },
  { id: 5, title: "Piano", instructor: "Mr. Beethoven Jr.", students: 30, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "grand piano", fees: 15000, paymentOptions: "Half Yearly" },
  { id: 6, title: "Drums", instructor: "Mr. Ringo Starr", students: 40, duration: "10 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "drum kit", fees: 3500, paymentOptions: "Monthly" },
  { id: 7, title: "Violin", instructor: "Ms. Vanessa Mae", students: 25, duration: "Ongoing", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "violin instrument", fees: 6000, paymentOptions: "Quarterly" },
  { id: 8, title: "Western Dance", instructor: "Mr. Prabhu Deva", students: 110, duration: "8 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "hiphop dance", fees: 3000, paymentOptions: "Monthly" },
  { id: 9, title: "Zumba", instructor: "Ms. Gina Grant", students: 150, duration: "4 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "zumba fitness", fees: 2000, paymentOptions: "Monthly" },
  { id: 10, title: "Gymnastics", instructor: "Ms. Nadia Comaneci", students: 35, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "gymnastics sport", fees: 12000, paymentOptions: "Annually" },
  { id: 11, title: "Yoga", instructor: "Yogi Adityanath", students: 200, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "yoga meditation", fees: 1800, paymentOptions: "Monthly" },
  { id: 12, title: "Karate", instructor: "Sensei Morio Higaonna", students: 90, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "karate kick", fees: 1700, paymentOptions: "Monthly" },
  { id: 13, title: "Kalaripayattu", instructor: "Gurukkal Meenakshi Amma", students: 50, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "kalaripayattu martialart", fees: 8000, paymentOptions: "Half Yearly" },
  { id: 14, title: "Art & Craft", instructor: "Ms. Frida Kahlo", students: 120, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "art supplies", fees: 2200, paymentOptions: "Quarterly" },
]

export type Course = typeof initialCourses[0];

export default function CoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const handleEditClick = (course: Course) => {
    setEditingCourse({ ...course });
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
      toast({
        title: "Course Updated",
        description: `Details for ${editingCourse.title} have been saved.`,
      });
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    }
  };
  
  const handleFieldChange = (field: keyof Course, value: string | number) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: value });
    }
  };


  return (
    <>
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
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(course)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Details</DialogTitle>
            <DialogDescription>
              Make changes to the course information below.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" value={editingCourse.title} onChange={(e) => handleFieldChange('title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input id="instructor" value={editingCourse.instructor} onChange={(e) => handleFieldChange('instructor', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={editingCourse.level} onValueChange={(value) => handleFieldChange('level', value)}>
                        <SelectTrigger id="level"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Levels">All Levels</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" value={editingCourse.duration} onChange={(e) => handleFieldChange('duration', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fees">Fees</Label>
                    <Input id="fees" type="number" value={editingCourse.fees} onChange={(e) => handleFieldChange('fees', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentOptions">Payment</Label>
                    <Select value={editingCourse.paymentOptions} onValueChange={(value) => handleFieldChange('paymentOptions', value)}>
                        <SelectTrigger id="paymentOptions"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
