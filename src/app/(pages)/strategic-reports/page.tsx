
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getHistoricalEnrollmentData, getHistoricalRevenueData } from "@/lib/report-utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, School, Building, Handshake, BarChart2 } from "lucide-react";


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount / 100000) + 'L';
};

const competitiveData = [
    { metric: "Student Enrollment", vindyaa: "500+", competitorA: "450", competitorB: "380" },
    { metric: "Course Offerings", vindyaa: "15+", competitorA: "12", competitorB: "10" },
    { metric: "Avg. Google Rating", vindyaa: "4.8/5", competitorA: "4.6/5", competitorB: "4.5/5" },
    { metric: "Social Media Followers", vindyaa: "15K+", competitorA: "12K", competitorB: "8K" },
    { metric: "Years in Operation", vindyaa: "10+", competitorA: "8", competitorB: "12" },
];

export default function StrategicReportsPage() {
    const [loading, setLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const enrollment = getHistoricalEnrollmentData();
            const revenue = getHistoricalRevenueData();
            setEnrollmentData(enrollment);
            setRevenueData(revenue);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Strategic Reports for Long-Term Planning</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Trend Analysis</CardTitle>
                    <CardDescription>Growth in enrollment and revenue over the past five years.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-center">Total Student Enrollment</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            {loading ? <Skeleton className="h-full w-full" /> : (
                                <AreaChart data={enrollmentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2 text-center">Annual Revenue</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            {loading ? <Skeleton className="h-full w-full" /> : (
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 /> Competitive Benchmarking</CardTitle>
                        <CardDescription>How the academy compares with other top schools in the region.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead className="text-center">VINDYAA</TableHead>
                                    <TableHead className="text-center">Competitor A</TableHead>
                                    <TableHead className="text-center">Competitor B</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {competitiveData.map((row) => (
                                    <TableRow key={row.metric}>
                                        <TableCell className="font-medium">{row.metric}</TableCell>
                                        <TableCell className="text-center font-bold text-primary">{row.vindyaa}</TableCell>
                                        <TableCell className="text-center">{row.competitorA}</TableCell>
                                        <TableCell className="text-center">{row.competitorB}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building /> Expansion Feasibility Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <p>Analysis indicates strong demand in North and East Bangalore. The highest number of enquiries originate from Whitefield, followed by Hebbal.</p>
                           <div className="flex gap-2">
                                <Badge variant="secondary">High Demand: Whitefield</Badge>
                                <Badge variant="secondary">Moderate Demand: Hebbal</Badge>
                                <Badge variant="outline">Potential: Yelahanka</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">Recommendation: Conduct on-ground surveys in Whitefield for a potential new branch in the next 18-24 months.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Handshake /> Scholarship & Sponsorship Impact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>Our scholarship program has supported <strong>25 underprivileged students</strong> this year, leading to a <strong>30% increase in positive media mentions</strong> and strengthening community ties.</p>
                             <p className="text-sm text-muted-foreground">The recent sponsorship of the "Nritya Utsav" community event has boosted brand visibility, resulting in a 15% spike in website traffic post-event.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
