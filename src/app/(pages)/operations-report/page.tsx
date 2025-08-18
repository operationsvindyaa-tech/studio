
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getExpenses, Expense } from "@/lib/expenses-db";
import {
    analyzeRoomUsage,
    getCapacityReport,
    getMaintenanceReport,
} from "@/lib/report-utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Wrench, AlertTriangle } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function OperationsReportPage() {
    const [loading, setLoading] = useState(true);
    const [roomUsage, setRoomUsage] = useState<any[]>([]);
    const [capacityData, setCapacityData] = useState<{ overCapacity: any[], underCapacity: any[] }>({ overCapacity: [], underCapacity: [] });
    const [maintenanceData, setMaintenanceData] = useState<{ totalCost: number, recentActivities: Expense[] }>({ totalCost: 0, recentActivities: [] });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const expenses = await getExpenses();
                setRoomUsage(analyzeRoomUsage());
                setCapacityData(getCapacityReport());
                setMaintenanceData(getMaintenanceReport(expenses));
            } catch (error) {
                console.error("Failed to fetch operations data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Operations Reports</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock /> Class Scheduling Efficiency</CardTitle>
                    <CardDescription>Studio and room usage based on scheduled classes, highlighting peak hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        {loading ? <Skeleton className="h-full w-full" /> : (
                            <BarChart data={roomUsage}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis dataKey="usage" suffix="%" />
                                <Tooltip />
                                <Bar dataKey="usage" fill="hsl(var(--primary))" name="Usage" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Class Capacity Reports</CardTitle>
                        <CardDescription>Analysis of class enrollment versus maximum capacity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" /> Over Capacity Classes</h4>
                            {loading ? <Skeleton className="h-24 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow><TableHead>Class</TableHead><TableHead>Enrolled</TableHead><TableHead>Capacity</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {capacityData.overCapacity.map(item => (
                                            <TableRow key={item.course}>
                                                <TableCell className="font-medium">{item.course}</TableCell>
                                                <TableCell>{item.actual}</TableCell>
                                                <TableCell><Badge variant="destructive">{item.capacity}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-500"><AlertTriangle className="h-5 w-5" /> Under Capacity Classes</h4>
                            {loading ? <Skeleton className="h-24 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow><TableHead>Class</TableHead><TableHead>Enrolled</TableHead><TableHead>Capacity</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {capacityData.underCapacity.map(item => (
                                            <TableRow key={item.course}>
                                                <TableCell className="font-medium">{item.course}</TableCell>
                                                <TableCell>{item.actual}</TableCell>
                                                <TableCell><Badge variant="outline">{item.capacity}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wrench /> Facility Maintenance Report</CardTitle>
                        <CardDescription>Summary of maintenance costs and recent activities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Total Maintenance Costs (YTD)</p>
                            {loading ? <Skeleton className="h-8 w-32 mt-1" /> : <p className="text-3xl font-bold">{formatCurrency(maintenanceData.totalCost)}</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Recent Maintenance Activities</h4>
                             {loading ? <Skeleton className="h-32 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Cost</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {maintenanceData.recentActivities.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
