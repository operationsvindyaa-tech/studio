
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudents, type Student } from "@/lib/db";
import { getProgressReports, updateProgressReport, type ProgressReport } from "@/lib/progress-db";
import { TrendingUp, Percent, CheckCircle2, MessageSquare, Printer, CalendarCheck, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProgressReportPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [filteredReport, setFilteredReport] = useState<ProgressReport | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentData, reportData] = await Promise.all([getStudents(), getProgressReports()]);
            setStudents(studentData);
            setProgressReports(reportData);
            if (studentData.length > 0) {
                setSelectedStudentId(studentData[0].id);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            const studentReports = progressReports.filter(r => r.studentId === selectedStudentId);
            const defaultCourse = studentReports.length > 0 ? studentReports[0].course : '';
            setSelectedCourse(defaultCourse);
        }
    }, [selectedStudentId, progressReports]);

    useEffect(() => {
        if (selectedStudentId && selectedCourse) {
            const report = progressReports.find(r => r.studentId === selectedStudentId && r.course === selectedCourse);
            setFilteredReport(report || null);
        } else {
            setFilteredReport(null);
        }
    }, [selectedStudentId, selectedCourse, progressReports]);

    const student = students.find(s => s.id === selectedStudentId);
    const studentCourses = progressReports
        .filter(r => r.studentId === selectedStudentId)
        .map(r => r.course);

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const handleInputChange = (path: string, value: any) => {
        if (!filteredReport) return;

        const keys = path.split('.');
        setFilteredReport(prev => {
            if (!prev) return null;
            const newReport = JSON.parse(JSON.stringify(prev));
            let current = newReport;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newReport;
        });
    };

    const handleModuleScoreChange = (index: number, score: number) => {
        if (!filteredReport) return;
        const newModules = [...filteredReport.moduleProgress];
        newModules[index].score = Math.max(0, Math.min(100, score));
        handleInputChange('moduleProgress', newModules);
    };

    const handleSaveChanges = async () => {
        if (!filteredReport) return;
        setIsSaving(true);
        try {
            await updateProgressReport(filteredReport.reportId, filteredReport);
            await fetchData(); // Re-fetch all data to ensure consistency
            toast({
                title: "Success",
                description: "Progress report updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save changes.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp />
                                Student Progress Report
                            </CardTitle>
                            <CardDescription>
                                Select a student and course to view or edit their detailed progress.
                            </CardDescription>
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
                            <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={!selectedStudentId || studentCourses.length === 0}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentCourses.map(course => (
                                        <SelectItem key={course} value={course}>{course}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
            ) : student && filteredReport ? (
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start bg-muted/50 p-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{student.name}</h2>
                                <p className="text-muted-foreground">ID: {student.id}</p>
                                <p className="text-muted-foreground">Progress Report for <span className="font-semibold">{filteredReport.course}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                Print Report
                            </Button>
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <Select value={filteredReport.overallGrade} onValueChange={(value) => handleInputChange('overallGrade', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['A+', 'A', 'B+', 'B', 'C', 'D'].map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label htmlFor="classesAttended" className="text-xs">Attended</Label>
                                        <Input id="classesAttended" type="number" value={filteredReport.classesAttended} onChange={(e) => handleInputChange('classesAttended', Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="totalClasses" className="text-xs">Total</Label>
                                        <Input id="totalClasses" type="number" value={filteredReport.totalClasses} onChange={(e) => handleInputChange('totalClasses', Number(e.target.value))} />
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Next Assessment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                     <Input placeholder="Assessment Name" value={filteredReport.nextAssessment.name} onChange={(e) => handleInputChange('nextAssessment.name', e.target.value)} />
                                     <Input type="date" value={filteredReport.nextAssessment.date.split('T')[0]} onChange={(e) => handleInputChange('nextAssessment.date', new Date(e.target.value).toISOString())} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Module-wise Performance</h3>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Module</TableHead>
                                                <TableHead className="text-center w-24">Score (%)</TableHead>
                                                <TableHead>Progress</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredReport.moduleProgress.map((mod, index) => (
                                                <TableRow key={mod.moduleName}>
                                                    <TableCell className="font-medium">{mod.moduleName}</TableCell>
                                                    <TableCell>
                                                        <Input type="number" value={mod.score} onChange={(e) => handleModuleScoreChange(index, Number(e.target.value))} className="text-center" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Progress value={mod.score} className="w-full" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Instructor's Feedback</h3>
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Strengths</Label>
                                            <Textarea value={filteredReport.feedback.strengths} onChange={(e) => handleInputChange('feedback.strengths', e.target.value)} />
                                        </div>
                                         <div className="space-y-1">
                                            <Label className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />Areas for Improvement</Label>
                                            <Textarea value={filteredReport.feedback.areasForImprovement} onChange={(e) => handleInputChange('feedback.areasForImprovement', e.target.value)} />
                                        </div>
                                         <div className="space-y-1">
                                            <Label className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-500" />General Comments</Label>
                                             <Textarea value={filteredReport.feedback.comments} onChange={(e) => handleInputChange('feedback.comments', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <p>Please select a student and course to view their progress report.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
