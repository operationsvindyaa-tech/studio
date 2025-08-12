
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart as BarChartIcon, BookUser, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getStudents, type Student } from "@/lib/db";
import { groupAdmissionsByTimeframe, Timeframe } from "@/lib/admissions-utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type AdmissionData = {
  name: string;
  total: number;
};

export default function AdmissionsPage() {
    const [admissions, setAdmissions] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
    const [chartData, setChartData] = useState<AdmissionData[]>([]);

    useEffect(() => {
        const fetchAdmissions = async () => {
            setLoading(true);
            try {
                const data = await getStudents();
                setAdmissions(data);
            } catch (error) {
                console.error("Failed to fetch admissions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmissions();
    }, []);

    useEffect(() => {
        if (admissions.length > 0) {
            const groupedData = groupAdmissionsByTimeframe(admissions, timeframe);
            const formattedData = Object.entries(groupedData).map(([name, count]) => ({
                name,
                total: count
            })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
            setChartData(formattedData);
        }
    }, [admissions, timeframe]);

    const totalAdmissions = admissions.length;
    const admissionsThisMonth = admissions.filter(
        s => new Date(s.joined).getMonth() === new Date().getMonth() && new Date(s.joined).getFullYear() === new Date().getFullYear()
    ).length;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admissions Overview</h1>
            <Button asChild size="lg">
                <Link href="/admissions/new">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Admission
                </Link>
            </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Admissions</CardTitle>
                    <BookUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalAdmissions}</div>}
                    <p className="text-xs text-muted-foreground">All-time student admissions</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admissions This Month</CardTitle>
                    <BookUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{admissionsThisMonth}</div>}
                    <p className="text-xs text-muted-foreground">For {new Date().toLocaleString('default', { month: 'long' })}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{(totalAdmissions / 52).toFixed(1)}</div>}
                    <p className="text-xs text-muted-foreground">Average new admissions per week</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Admission Trends</CardTitle>
                        <CardDescription>
                            Admissions count over different time periods.
                        </CardDescription>
                    </div>
                    <Select value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {loading ? <Skeleton className="h-full w-full" /> : (
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" name="Admissions" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
