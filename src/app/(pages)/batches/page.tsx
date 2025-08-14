
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Clock, Users2 } from "lucide-react";

const coursesWithBatches = [
  {
    course: "Bharatanatyam",
    batches: [
      { id: "B01", time: "Mon, Wed, Fri - 5:00 PM", instructor: "Smt. Vani Ramesh", students: 15 },
      { id: "B02", time: "Tue, Thu - 6:00 PM", instructor: "Smt. Vani Ramesh", students: 12 },
      { id: "B03", time: "Sat, Sun - 10:00 AM", instructor: "Smt. Vani Ramesh", students: 20 },
    ],
  },
  {
    course: "Vocal Carnatic",
    batches: [
        { id: "V01", time: "Mon, Wed - 6:00 PM", instructor: "Vid. Shankar Mahadevan", students: 18 },
        { id: "V02", time: "Sat, Sun - 11:00 AM", instructor: "Vid. Shankar Mahadevan", students: 22 },
    ],
  },
  {
    course: "Guitar",
    batches: [
        { id: "G01", time: "Tue, Thu - 7:00 PM", instructor: "Mr. Alex Johnson", students: 25 },
        { id: "G02", time: "Fri - 6:00 PM", instructor: "Mr. Alex Johnson", students: 18 },
    ],
  },
  {
    course: "Yoga",
    batches: [
        { id: "Y01", time: "Mon to Fri - 7:00 AM", instructor: "Yogi Adityanath", students: 30 },
        { id: "Y02", time: "Sat, Sun - 8:00 AM", instructor: "Yogi Adityanath", students: 40 },
    ],
  },
];

const allCourses = coursesWithBatches.map(c => c.course);

export default function BatchesPage() {
  const [selectedCourse, setSelectedCourse] = useState(allCourses[0]);

  const courseData = coursesWithBatches.find(c => c.course === selectedCourse);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Course Batches</CardTitle>
              <CardDescription>
                View and manage batches for each course.
              </CardDescription>
            </div>
            <div className="flex gap-2">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        {allCourses.map(course => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Batch
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {courseData ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseData.batches.map(batch => (
                        <Card key={batch.id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{courseData.course}</CardTitle>
                                    <Badge>{batch.id}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{batch.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{batch.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users2 className="h-4 w-4" />
                                    <span>{batch.students} Students</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Select a course to view its batches.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
