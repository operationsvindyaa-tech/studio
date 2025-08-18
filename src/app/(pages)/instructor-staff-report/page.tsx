
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { getStaff, Staff } from "@/lib/staff-db";
import { getTeacherPerformanceData, TeacherPerformance } from "@/lib/teacher-performance-db";
import { 
    getInstructorUtilization,
    getInstructorPerformance,
    getPayrollBreakdown,
} from "@/lib/report-utils";
import { Users, BarChart, Wallet, Star } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function InstructorStaffReportPage() {
    const [loading, setLoading] = useState(true);
    const [utilizationData, setUtilizationData] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [payrollBreakdown, setPayrollBreakdown] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [staff, performance] = await Promise.all([
                    getStaff(),
                    getTeacherPerformanceData(),
                ]);
                
                setUtilizationData(getInstructorUtilization(staff));
                setPerformanceData(getInstructorPerformance(staff, performance));
                setPayrollBreakdown(getPayrollBreakdown(staff));

            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const totalPayroll = payrollBreakdown.reduce((sum, dept) => sum + dept.total, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Instructor & Staff Reports</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Instructor Utilization</CardTitle>
                        <CardDescription>Comparison of hours taught versus contracted hours for the current month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-64 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Instructor</TableHead>
                                        <TableHead>Hours Taught</TableHead>
                                        <TableHead>Contracted Hours</TableHead>
                                        <TableHead>Utilization</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {utilizationData.map((instructor) => (
                                        <TableRow key={instructor.name}>
                                            <TableCell className="font-medium">{instructor.name}</TableCell>
                                            <TableCell>{instructor.hoursTaught}</TableCell>
                                            <TableCell>{instructor.contractedHours}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={(instructor.hoursTaught / instructor.contractedHours) * 100} className="w-24" />
                                                    <span>{((instructor.hoursTaught / instructor.contractedHours) * 100).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wallet /> Payroll & Compensation</CardTitle>
                        <CardDescription>Summary of monthly salary and benefits disbursements by department.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Total Monthly Payroll</p>
                            {loading ? <Skeleton className="h-8 w-32 mt-1" /> : <p className="text-3xl font-bold">{formatCurrency(totalPayroll)}</p>}
                        </div>
                        {loading ? <Skeleton className="h-40 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payrollBreakdown.map(dept => (
                                        <TableRow key={dept.department}>
                                            <TableCell className="font-medium">{dept.department}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(dept.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                     <TableRow className="font-bold border-t-2">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">{formatCurrency(totalPayroll)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart /> Instructor Performance</CardTitle>
                    <CardDescription>Key performance indicators based on student feedback and retention.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-80 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead className="text-center">Student Feedback</TableHead>
                                    <TableHead className="text-center">Students Taught</TableHead>
                                    <TableHead className="text-center">Student Retention Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {performanceData.map((instructor) => (
                                    <TableRow key={instructor.name}>
                                        <TableCell className="font-medium">{instructor.name}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1 font-semibold">
                                                {instructor.feedbackScore.toFixed(1)} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{instructor.studentsTaught}</TableCell>
                                        <TableCell className="text-center font-semibold text-green-600">{instructor.retentionRate}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
