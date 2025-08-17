
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { getStudents, type Student } from "@/lib/db";
import { getAttendanceForStudent, type AttendanceRecord } from "@/lib/student-attendance-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Coffee, BookOpen } from "lucide-react";

export default function StudentAttendancePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentData = await getStudents();
            setStudents(studentData);
            if (studentData.length > 0) {
                setSelectedStudentId(studentData[0].id);
                const attendanceData = await getAttendanceForStudent(studentData[0].id);
                setAttendance(attendanceData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleStudentChange = async (studentId: string) => {
        setSelectedStudentId(studentId);
        setLoading(true);
        const attendanceData = await getAttendanceForStudent(studentId);
        setAttendance(attendanceData);
        setLoading(false);
    };

    const student = students.find(s => s.id === selectedStudentId);

    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const absentDays = attendance.filter(a => a.status === 'Absent').length;
    const totalClasses = presentDays + absentDays;
    const attendancePercentage = totalClasses > 0 ? ((presentDays / totalClasses) * 100).toFixed(0) : 0;

    const modifiers = {
        present: attendance.filter(a => a.status === 'Present').map(a => new Date(a.date)),
        absent: attendance.filter(a => a.status === 'Absent').map(a => new Date(a.date)),
        holiday: attendance.filter(a => a.status === 'Holiday').map(a => new Date(a.date)),
    };
    
    const modifiersClassNames = {
        present: 'bg-green-500 text-white rounded-full',
        absent: 'bg-red-500 text-white rounded-full',
        holiday: 'bg-yellow-500 text-white rounded-full',
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>My Attendance Portal</CardTitle>
                            <CardDescription>
                                View your attendance record for all enrolled courses.
                            </CardDescription>
                        </div>
                        <div className="w-full max-w-sm">
                             <Select value={selectedStudentId} onValueChange={handleStudentChange} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? <Skeleton className="h-96 w-full" /> : student ? (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>{student.initials}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold">{student.name}</h2>
                                <p className="text-muted-foreground">{student.id}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Enrolled Courses</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {student.enrolledCourses?.map(course => (
                                    <div key={course} className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{course.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Attendance</span>
                                    <Badge variant="secondary">{attendancePercentage}%</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Total Classes</span>
                                    <span>{totalClasses}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Classes Attended</span>
                                    <span>{presentDays}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Classes Absent</span>
                                    <span>{absentDays}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Calendar</CardTitle>
                                <CardDescription>Your monthly attendance overview.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        modifiers={modifiers}
                                        modifiersClassNames={modifiersClassNames}
                                        className="rounded-md border"
                                    />
                                </div>
                                <div className="flex justify-center gap-4 mt-4 text-sm">
                                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Present</div>
                                    <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" /> Absent</div>
                                    <div className="flex items-center gap-2"><Coffee className="h-4 w-4 text-yellow-500" /> Holiday</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <p>Please select a student to view their attendance.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
