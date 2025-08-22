
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudents, type Student } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Note = {
    title: string;
    date: string;
    fileUrl: string;
};

type CourseNotes = {
    [courseKey: string]: Note[];
};

// Mock data for notes
const courseNotesData: CourseNotes = {
    "bharatanatyam": [
        { title: "Adavu Theory - Part 1", date: "2024-07-15", fileUrl: "#" },
        { title: "Hasta Mudras Chart", date: "2024-07-20", fileUrl: "#" },
    ],
    "vocal-carnatic": [
        { title: "Sarali Varisai Notations", date: "2024-07-16", fileUrl: "#" },
        { title: "Introduction to Talas", date: "2024-07-22", fileUrl: "#" },
    ],
    "yoga": [
        { title: "Benefits of Surya Namaskar", date: "2024-07-18", fileUrl: "#" },
    ]
};

export default function NotesPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentData = await getStudents();
            setStudents(studentData);
            if (studentData.length > 0) {
                setSelectedStudentId(studentData[0].id);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const student = students.find(s => s.id === selectedStudentId);
    const enrolledCourses = student?.enrolledCourses || [];

    useEffect(() => {
        if (student && enrolledCourses.length > 0) {
            setSelectedCourse(enrolledCourses[0]);
        }
    }, [student, enrolledCourses]);

    useEffect(() => {
        if (selectedCourse) {
            setNotes(courseNotesData[selectedCourse] || []);
        } else {
            setNotes([]);
        }
    }, [selectedCourse]);


    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Course Notes & Materials</CardTitle>
                        <CardDescription>Download notes and resources for your enrolled courses.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={loading}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Select Student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={loading || !student}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {enrolledCourses.map(courseKey => {
                                    const courseName = courseKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                    return <SelectItem key={courseKey} value={courseKey}>{courseName}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : notes.length > 0 ? (
                    <div className="border rounded-lg">
                        <ul className="divide-y">
                            {notes.map((note, index) => (
                                <li key={index} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-semibold">{note.title}</p>
                                            <p className="text-sm text-muted-foreground">Uploaded on: {new Date(note.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={note.fileUrl} download>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No notes available for {selectedCourse.replace('-', ' ')} yet.</p>
                        <p className="text-sm">Please check back later or contact your instructor.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
