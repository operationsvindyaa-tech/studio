
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getStudents, type Student } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const courses = [
  "All Courses", "Bharatanatyam", "Vocal Carnatic", "Keyboard/Piano", "Guitar",
  "Yoga", "Western Dance", "Art & Craft", "Karate", "Kalaripayattu", "Zumba", "Gymnastics"
];

type AttendanceStatus = "Present" | "Absent" | "Unmarked";
type AttendanceRecord = {
    [studentId: string]: AttendanceStatus;
};

export default function AttendancePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<string>("All Courses");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendance, setAttendance] = useState<AttendanceRecord>({});
    const { toast } = useToast();

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                const studentData = await getStudents();
                setStudents(studentData);
                setFilteredStudents(studentData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load students. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [toast]);

    useEffect(() => {
        if (selectedActivity === "All Courses") {
            setFilteredStudents(students);
        } else {
            const courseKey = selectedActivity.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            setFilteredStudents(students.filter(s => s.desiredCourse === courseKey));
        }
        // Reset attendance when filter changes
        setAttendance({});
    }, [selectedActivity, students]);
    
    useEffect(() => {
        // Reset attendance when date changes
        setAttendance({});
    }, [selectedDate]);

    const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };
    
    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case "Present":
                return "border-green-500 bg-green-50";
            case "Absent":
                return "border-red-500 bg-red-50";
            default:
                return "border-transparent";
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <CardTitle>Attendance Tracking</CardTitle>
                        <CardDescription>Mark student attendance for activities on a selected date.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Select an activity" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map(course => (
                                    <SelectItem key={course} value={course}>{course}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal md:w-[240px]", !selectedDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {loading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                           <Card key={i} className="flex flex-col items-center p-4">
                               <Skeleton className="h-20 w-20 rounded-full" />
                               <Skeleton className="h-4 w-24 mt-2" />
                               <Skeleton className="h-3 w-16 mt-1" />
                               <div className="flex gap-2 mt-4">
                                   <Skeleton className="h-8 w-16 rounded-full" />
                                   <Skeleton className="h-8 w-16 rounded-full" />
                               </div>
                           </Card>
                        ))
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map(student => {
                            const status = attendance[student.id] || "Unmarked";
                            return (
                                <Card key={student.id} className={cn("flex flex-col items-center text-center p-4 border-2 transition-colors", getStatusColor(status))}>
                                    <Avatar className="h-20 w-20 mb-2">
                                        <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person" />
                                        <AvatarFallback>{student.initials}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold text-sm">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">{student.id}</p>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={status === "Present" ? "default" : "outline"}
                                            onClick={() => handleAttendanceChange(student.id, "Present")}
                                            className="rounded-full px-4 bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 data-[variant=outline]:border-green-600"
                                        >
                                            <Check className="h-4 w-4 mr-1" /> Present
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={status === "Absent" ? "destructive" : "outline"}
                                            onClick={() => handleAttendanceChange(student.id, "Absent")}
                                             className="rounded-full px-4 data-[variant=outline]:text-red-600 data-[variant=outline]:border-red-600"
                                        >
                                            <X className="h-4 w-4 mr-1" /> Absent
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })
                    ) : (
                         <div className="col-span-full text-center py-10">
                            <p className="text-muted-foreground">No students found for this activity.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
