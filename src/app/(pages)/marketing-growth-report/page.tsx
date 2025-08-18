
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEnquiries, Enquiry } from "@/lib/enquiries-db";
import { getStudents, Student } from "@/lib/db";
import { 
    getConversionRate,
    analyzeEnquirySources
} from "@/lib/report-utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Percent, Megaphone, Ticket, Handshake, Heart, MessageCircle } from "lucide-react";


const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const socialMediaData = [
    { platform: "Instagram", followers: "15.2K", engagement: "5.8%", signups: 120 },
    { platform: "Facebook", followers: "10.5K", engagement: "3.2%", signups: 85 },
    { platform: "YouTube", followers: "8.1K", engagement: "12.5%", signups: 45 },
    { platform: "Website", followers: "N/A", engagement: "4.1% CTR", signups: 210 },
];

const eventPerformanceData = [
    { event: "Annual Day 'Nritya Utsav'", ticketsSold: 500, communityReach: "5000+", partnerships: 5 },
    { event: "Summer Workshop", ticketsSold: 150, communityReach: "2000+", partnerships: 2 },
];

export default function MarketingGrowthReportPage() {
    const [loading, setLoading] = useState(true);
    const [conversionData, setConversionData] = useState({ enquiries: 0, enrollments: 0, rate: 0 });
    const [sourceData, setSourceData] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const enquiries = await getEnquiries();
                const students = await getStudents();

                setConversionData(getConversionRate(enquiries, students));
                setSourceData(analyzeEnquirySources(enquiries));

            } catch (error) {
                console.error("Failed to fetch marketing data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Marketing & Growth Reports</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enquiries (Leads)</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{conversionData.enquiries}</div>}
                        <p className="text-xs text-muted-foreground">All-time enquiries received.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{conversionData.enrollments}</div>}
                        <p className="text-xs text-muted-foreground">Total students enrolled from enquiries.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{formatPercent(conversionData.rate)}</div>}
                        <p className="text-xs text-muted-foreground">Percentage of enquiries becoming students.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Source of Students</CardTitle>
                    <CardDescription>Breakdown of how students found the academy, based on enquiry data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        {loading ? <Skeleton className="h-full w-full" /> : (
                            <BarChart data={sourceData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="source" width={120} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Enquiries" />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Ticket /> Event Performance</CardTitle>
                        <CardDescription>Summary of recent major events and their impact.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead className="text-center">Tickets Sold</TableHead>
                                    <TableHead className="text-center">Community Reach</TableHead>
                                    <TableHead className="text-center">Partnerships</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventPerformanceData.map((event) => (
                                    <TableRow key={event.event}>
                                        <TableCell className="font-medium">{event.event}</TableCell>
                                        <TableCell className="text-center">{event.ticketsSold}</TableCell>
                                        <TableCell className="text-center">{event.communityReach}</TableCell>
                                        <TableCell className="text-center">{event.partnerships}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Heart /> Social Media & Website Engagement</CardTitle>
                        <CardDescription>Key metrics from our online presence and campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Platform</TableHead>
                                    <TableHead className="text-center">Followers</TableHead>
                                    <TableHead className="text-center">Engagement</TableHead>
                                    <TableHead className="text-center">Sign-ups</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {socialMediaData.map((social) => (
                                    <TableRow key={social.platform}>
                                        <TableCell className="font-medium">{social.platform}</TableCell>
                                        <TableCell className="text-center">{social.followers}</TableCell>
                                        <TableCell className="text-center">{social.engagement}</TableCell>
                                        <TableCell className="text-center">{social.signups}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
