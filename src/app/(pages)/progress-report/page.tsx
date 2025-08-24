
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
import { getProgressReports, type ProgressReport } from "@/lib/progress-db";
import { TrendingUp, Percent, CheckCircle2, MessageSquare, Printer, CalendarCheck, AlertTriangle } from "lucide-react";
import { getBillingData, type StudentBillingInfo, calculateTotal } from "@/lib/billing-db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

function PaymentNotification({ studentId }: { studentId: string }) {
    const [pendingInvoices, setPendingInvoices] = useState<StudentBillingInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!studentId) return;
            setLoading(true);
            const allBillingData = await getBillingData();
            const studentPending = allBillingData.filter(
                inv => inv.studentId === studentId && (inv.status === 'Due' || inv.status === 'Overdue')
            );
            setPendingInvoices(studentPending);
            setLoading(false);
        };
        fetchInvoices();
    }, [studentId]);

    const totalDue = pendingInvoices.reduce((sum, inv) => sum + calculateTotal(inv), 0);

    if (loading || pendingInvoices.length === 0) {
        return null;
    }

    return (
         <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Reminder</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
                <div>
                    You have {pendingInvoices.length} pending invoice(s) totaling ₹{totalDue.toFixed(2)}. Please clear your dues.
                </div>
                <Button asChild>
                    <Link href="/my-payments">View Invoices</Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
}

export default function ProgressReportPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [filteredReport, setFilteredReport] = useState<ProgressReport | null>(null);

    useEffect(() => {
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

    return (
        <div className="space-y-6">
            <PaymentNotification studentId={selectedStudentId} />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp />
                                Student Progress Report
                            </CardTitle>
                            <CardDescription>
                                Select a student and course to view their detailed progress.
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
                        <Button variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Report
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                                    <Badge className={getGradeColor(filteredReport.overallGrade)}>{filteredReport.overallGrade}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">Based on all assessments</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{filteredReport.attendancePercentage}%</div>
                                    <p className="text-xs text-muted-foreground">{filteredReport.classesAttended} out of {filteredReport.totalClasses} classes attended</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Next Assessment</CardTitle>
                                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold">{filteredReport.nextAssessment.name}</div>
                                    <p className="text-xs text-muted-foreground">on {new Date(filteredReport.nextAssessment.date).toLocaleDateString()}</p>
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
                                                <TableHead className="text-center">Score</TableHead>
                                                <TableHead>Progress</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredReport.moduleProgress.map(mod => (
                                                <TableRow key={mod.moduleName}>
                                                    <TableCell className="font-medium">{mod.moduleName}</TableCell>
                                                    <TableCell className="text-center">{mod.score}%</TableCell>
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
                                            <p className="text-sm font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Strengths</p>
                                            <p className="text-sm text-muted-foreground pl-6">{filteredReport.feedback.strengths}</p>
                                        </div>
                                         <div className="space-y-1">
                                            <p className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />Areas for Improvement</p>
                                            <p className="text-sm text-muted-foreground pl-6">{filteredReport.feedback.areasForImprovement}</p>
                                        </div>
                                         <div className="space-y-1">
                                            <p className="text-sm font-medium flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-500" />General Comments</p>
                                            <p className="text-sm text-muted-foreground pl-6">{filteredReport.feedback.comments}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-right pt-2 border-t">
                                            - {filteredReport.teacherName}, {new Date(filteredReport.reportDate).toLocaleDateString()}
                                        </p>
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
