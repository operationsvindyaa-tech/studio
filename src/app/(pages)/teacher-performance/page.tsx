
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Clock, MessageSquare, BookOpen } from "lucide-react";
import { getTeachers, type Teacher } from "@/lib/teachers-db";
import { getTeacherPerformanceData, type TeacherPerformance } from "@/lib/teacher-performance-db";
import { Skeleton } from "@/components/ui/skeleton";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function TeacherPerformancePage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [performanceData, setPerformanceData] = useState<TeacherPerformance[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [teacherList, perfData] = await Promise.all([getTeachers(), getTeacherPerformanceData()]);
                setTeachers(teacherList);
                setPerformanceData(perfData);
                if (teacherList.length > 0) {
                    setSelectedTeacherId(teacherList[0].id);
                }
            } catch (error) {
                console.error("Failed to load teacher data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
    const selectedPerformance = performanceData.find(p => p.teacherId === selectedTeacherId);

    const chartConfig = {
        score: {
          label: "Score",
          color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex-row justify-between items-center">
                    <div>
                        <CardTitle>Teacher Performance Review</CardTitle>
                        <CardDescription>Select a teacher to view their performance metrics and feedback.</CardDescription>
                    </div>
                    <div className="w-full max-w-sm">
                        <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-12">
                    <div className="md:col-span-3"><Skeleton className="h-48" /></div>
                    <div className="md:col-span-9 grid grid-cols-3 gap-6">
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </div>
                    <div className="md:col-span-5"><Skeleton className="h-80" /></div>
                    <div className="md:col-span-7"><Skeleton className="h-80" /></div>
                </div>
            ) : selectedTeacher && selectedPerformance ? (
                <div className="grid gap-6 md:grid-cols-12">
                    <Card className="md:col-span-3 flex flex-col items-center justify-center text-center">
                        <CardContent className="pt-6">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                                <AvatarFallback>{selectedTeacher.initials}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                            <p className="text-muted-foreground">{selectedTeacher.designation}</p>
                            <p className="text-sm text-muted-foreground mt-2">{selectedTeacher.department}</p>
                        </CardContent>
                    </Card>

                    <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Student Performance</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{selectedPerformance.avgStudentPerformance}%</div>
                                <p className="text-xs text-muted-foreground">in assessments for their courses</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Punctuality</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{selectedPerformance.punctuality}%</div>
                                <p className="text-xs text-muted-foreground">attendance rate this semester</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Student Feedback</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{selectedPerformance.studentFeedbackScore.toFixed(1)} / 5.0</div>
                                <p className="text-xs text-muted-foreground">based on {selectedPerformance.recentFeedback.length} recent reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="md:col-span-5">
                        <CardHeader>
                            <CardTitle>Performance Radar</CardTitle>
                            <CardDescription>Scores are rated on a scale of 1 to 100.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ChartContainer config={chartConfig} className="mx-auto aspect-square h-64">
                                <RadarChart data={selectedPerformance.performanceMetrics}>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <PolarAngleAxis dataKey="metric" />
                                    <PolarGrid />
                                    <Radar
                                        dataKey="score"
                                        fill="var(--color-score)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-score)"
                                    />
                                </RadarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                     <Card className="md:col-span-7">
                        <CardHeader>
                            <CardTitle>Recent Student Feedback</CardTitle>
                             <CardDescription>Latest comments from students in their courses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead className="text-right">Rating</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedPerformance.recentFeedback.map((feedback, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{feedback.course}</TableCell>
                                            <TableCell className="text-muted-foreground">{feedback.comment}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={feedback.rating > 4 ? "secondary" : "outline"} className={feedback.rating > 4 ? "bg-green-100 text-green-800" : ""}>
                                                    {feedback.rating.toFixed(1)} <Star className="ml-1 h-3 w-3" />
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <p>No performance data available for the selected teacher.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

    