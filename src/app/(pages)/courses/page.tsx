
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, PlusCircle, Wallet, CalendarDays, Edit } from "lucide-react"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCourses, updateCourses, type Course } from "@/lib/courses-db";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
        const data = await getCourses();
        setCourses(data);
        setLoading(false);
    }
    fetchCourses();
  }, []);

  const handleEditClick = (course: Course) => {
    setEditingCourse({ ...course });
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCourse) {
      const updatedCourses = courses.map(c => c.id === editingCourse.id ? editingCourse : c);
      setCourses(updatedCourses);
      updateCourses(updatedCourses); // Update in-memory db
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
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}><Skeleton className="w-full h-80" /></Card>
            ))
          ) : (
            courses.map((course) => (
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
          )))}
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
