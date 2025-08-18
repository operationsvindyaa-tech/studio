
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getStudents, Student } from "@/lib/db";
import { 
    analyzeEnrollmentTrends, 
    getStudentDemographics, 
    getAttendanceOverview,
    getRetentionRates,
    getPerformanceSummary
} from "@/lib/report-utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, PieChart as PieChartIcon, CheckCircle, XCircle, Percent, BarChart2 } from "lucide-react";

const DEMOGRAPHICS_COLORS = {
    Active: 'hsl(var(--chart-1))',
    Inactive: 'hsl(var(--chart-2))',
    Suspended: 'hsl(var(--chart-5))',
};

export default function StudentEnrollmentReportPage() {
    const [loading, setLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
    const [demographicsData, setDemographicsData] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<{ mostAttended: any[], leastAttended: any[] }>({ mostAttended: [], leastAttended: [] });
    const [retentionData, setRetentionData] = useState<{ retentionRate: number, dropoutRate: number }>({ retentionRate: 0, dropoutRate: 0 });
    const [performanceData, setPerformanceData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const students = await getStudents();
            
            // Enrollment Trends
            setEnrollmentData(analyzeEnrollmentTrends(students));

            // Demographics
            const demographics = getStudentDemographics(students);
            setDemographicsData(Object.entries(demographics).map(([name, value]) => ({ name, value })));

            // Attendance
            setAttendanceData(getAttendanceOverview());
            
            // Retention
            setRetentionData(getRetentionRates());

            // Performance
            const performance = getPerformanceSummary();
            setPerformanceData(Object.entries(performance).map(([grade, count]) => ({ grade, count })));

            setLoading(false);
        };
        fetchData();
    }, []);

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Student & Enrollment Reports</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Enrollment Trends</CardTitle>
                    <CardDescription>Monthly new student admissions over the last year.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        {loading ? <Skeleton className="h-full w-full" /> : (
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="New Students" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChartIcon /> Student Demographics</CardTitle>
                        <CardDescription>Distribution of students by their current status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                             {loading ? <Skeleton className="h-full w-full" /> : (
                                <PieChart>
                                    <Pie data={demographicsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {demographicsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DEMOGRAPHICS_COLORS[entry.name as keyof typeof DEMOGRAPHICS_COLORS] || '#cccccc'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                             )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Retention & Dropout</CardTitle>
                        <CardDescription>Annual student retention and dropout rates.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted flex items-center gap-4">
                            <div className="bg-background p-3 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                {loading ? <Skeleton className="h-7 w-12 mb-1" /> : <p className="text-2xl font-bold">{retentionData.retentionRate}%</p> }
                                <p className="text-sm text-muted-foreground">Retention Rate</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted flex items-center gap-4">
                            <div className="bg-background p-3 rounded-full">
                                <XCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                 {loading ? <Skeleton className="h-7 w-12 mb-1" /> : <p className="text-2xl font-bold">{retentionData.dropoutRate}%</p> }
                                <p className="text-sm text-muted-foreground">Dropout Rate</p>
                            </div>
                        </div>
                         <p className="col-span-2 text-xs text-muted-foreground pt-2">
                            Analysis based on students who did not re-enroll in the subsequent term. Identifying reasons through exit feedback is recommended for improving retention.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Percent /> Class Attendance Reports</CardTitle>
                        <CardDescription>Highlights of class attendance across the academy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Most Attended Classes</h4>
                            {loading ? <Skeleton className="h-16 w-full" /> : 
                                <Table>
                                    <TableBody>
                                        {attendanceData.mostAttended.map(item => (
                                            <TableRow key={item.course}><TableCell>{item.course}</TableCell><TableCell className="text-right font-bold text-green-600">{item.rate}%</TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Least Attended Classes</h4>
                            {loading ? <Skeleton className="h-16 w-full" /> : 
                                <Table>
                                    <TableBody>
                                        {attendanceData.leastAttended.map(item => (
                                            <TableRow key={item.course}><TableCell>{item.course}</TableCell><TableCell className="text-right font-bold text-red-600">{item.rate}%</TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 /> Progress & Exam Results</CardTitle>
                        <CardDescription>Overall student performance based on latest assessments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-48 w-full" /> : 
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Grade</TableHead>
                                        <TableHead className="text-right">Number of Students</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceData.map(item => (
                                        <TableRow key={item.grade}>
                                            <TableCell><Badge className={getGradeColor(item.grade)}>{item.grade}</Badge></TableCell>
                                            <TableCell className="text-right font-medium">{item.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
