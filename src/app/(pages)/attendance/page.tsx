
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Check, X, MessageSquareWarning } from "lucide-react";
import { format, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { getStudents, type Student } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { notifyParentOfAbsence } from "./actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { timetableData } from "@/lib/timetable-db";
import { getTeachers, Teacher } from "@/lib/teachers-db";

const courses = [
  "All Courses", "Bharatanatyam", "Vocal Carnatic", "Keyboard/Piano", "Guitar",
  "Yoga", "Western Dance", "Art & Craft", "Karate", "Kalaripayattu", "Zumba", "Gymnastics"
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    const [selectedBatch, setSelectedBatch] = useState<string>("All Batches");
    const [availableBatches, setAvailableBatches] = useState<string[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord>({});
    const [studentToNotify, setStudentToNotify] = useState<Student | null>(null);
    const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [availableTeachers, setAvailableTeachers] = useState<string[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("All Teachers");
    const { toast } = useToast();

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            try {
                const [studentData, teacherData] = await Promise.all([getStudents(), getTeachers()]);
                setStudents(studentData);
                setTeachers(teacherData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load students or teachers. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, [toast]);

    useEffect(() => {
        const dayOfWeek = daysOfWeek[getDay(selectedDate)];
        const center = "Main Campus (Basavanapura)"; // Assuming a default center for now
        
        const batches = new Set<string>();
        const teacherSet = new Set<string>();

        if (timetableData[center] && timetableData[center][dayOfWeek]) {
            for (const time in timetableData[center][dayOfWeek]) {
                const entry = timetableData[center][dayOfWeek][time];
                if (selectedActivity === "All Courses" || entry.course === selectedActivity) {
                    batches.add(entry.time);
                    if (entry.instructor) {
                        teacherSet.add(entry.instructor);
                    }
                }
            }
        }
        setAvailableBatches(Array.from(batches).sort());
        setAvailableTeachers(Array.from(teacherSet).sort());
        setSelectedBatch("All Batches");
        setSelectedTeacher("All Teachers");
    }, [selectedActivity, selectedDate]);

    useEffect(() => {
        let currentStudents = students;
        
        if (selectedActivity !== "All Courses") {
            const courseKey = selectedActivity.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            currentStudents = students.filter(s => s.enrolledCourses?.includes(courseKey));
        }
        
        // This is a simplified logic. A real app would have students assigned to specific teachers/batches.
        // For now, we assume if a teacher is selected, we show all students for the selected course.
        setFilteredStudents(currentStudents);
        setAttendance({});
    }, [selectedActivity, selectedBatch, selectedTeacher, students, selectedDate]);
    
    const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };
    
    const handleNotifyClick = (student: Student) => {
        setStudentToNotify(student);
        setIsNotifyDialogOpen(true);
    };

    const confirmSendNotification = async () => {
        if (!studentToNotify) return;

        const result = await notifyParentOfAbsence(studentToNotify);
        
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        setIsNotifyDialogOpen(false);
        setStudentToNotify(null);
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
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <CardTitle>Student Attendance Tracking</CardTitle>
                            <CardDescription>Mark student attendance for activities on a selected date.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto flex-wrap justify-end">
                            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                                <SelectTrigger className="w-full min-w-[180px] md:w-auto">
                                    <SelectValue placeholder="Select an activity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course} value={course}>{course}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={availableTeachers.length === 0}>
                                <SelectTrigger className="w-full min-w-[180px] md:w-auto">
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Teachers">All Teachers</SelectItem>
                                    {availableTeachers.map(teacher => (
                                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={availableBatches.length === 0}>
                                <SelectTrigger className="w-full min-w-[180px] md:w-auto">
                                    <SelectValue placeholder="Select batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Batches">All Batches</SelectItem>
                                    {availableBatches.map(batch => (
                                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal md:w-auto", !selectedDate && "text-muted-foreground")}
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
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={status === "Present" ? "default" : "outline"}
                                                    onClick={() => handleAttendanceChange(student.id, "Present")}
                                                    className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-600 data-[variant=outline]:border-green-600"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === "Absent" ? "destructive" : "outline"}
                                                    onClick={() => handleAttendanceChange(student.id, "Absent")}
                                                    className="data-[variant=outline]:text-red-600 data-[variant=outline]:border-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {status === 'Absent' && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="w-full"
                                                    onClick={() => handleNotifyClick(student)}
                                                >
                                                    <MessageSquareWarning className="mr-2 h-4 w-4" /> Notify
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })
                        ) : (
                             <div className="col-span-full text-center py-10">
                                <p className="text-muted-foreground">No students found for this filter.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to send an SMS notification to the parent of {studentToNotify?.name} regarding their absence?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setStudentToNotify(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSendNotification}>
                            Send Notification
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
