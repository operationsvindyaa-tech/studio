
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExamEvents, type ExamEvent } from "@/lib/schedule-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ListOrdered } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coursesWithBatches } from "@/lib/batches-db";

const activities = coursesWithBatches.map(c => c.course);

export default function ExamUpdatesPage() {
    const [allExamEvents, setAllExamEvents] = useState<ExamEvent[]>([]);
    const [filteredExamEvents, setFilteredExamEvents] = useState<ExamEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<string>("All Activities");
    const [selectedBatch, setSelectedBatch] = useState<string>("All Batches");
    const [availableBatches, setAvailableBatches] = useState<string[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await getExamEvents();
            setAllExamEvents(data);
            setFilteredExamEvents(data);
            setLoading(false);
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedActivity === "All Activities") {
            setAvailableBatches([]);
        } else {
            const course = coursesWithBatches.find(c => c.course === selectedActivity);
            const batches = course ? course.batches.map(b => b.time) : [];
            setAvailableBatches(batches);
        }
        setSelectedBatch("All Batches");
    }, [selectedActivity]);

    useEffect(() => {
        let filtered = allExamEvents;

        if (selectedActivity !== "All Activities") {
            filtered = filtered.filter(event => event.activity === selectedActivity);
        }

        if (selectedBatch !== "All Batches") {
            filtered = filtered.filter(event => event.batch === selectedBatch);
        }

        setFilteredExamEvents(filtered);
    }, [selectedActivity, selectedBatch, allExamEvents]);


    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ListOrdered className="h-6 w-6" />
                        <div>
                            <CardTitle>Exam Updates</CardTitle>
                            <CardDescription>Schedule for all upcoming examinations.</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select Activity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Activities">All Activities</SelectItem>
                                {activities.map(activity => (
                                    <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Select value={selectedBatch} onValueChange={setSelectedBatch} disabled={availableBatches.length === 0}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Batches">All Batches</SelectItem>
                                {availableBatches.map(batch => (
                                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                    ) : filteredExamEvents.length > 0 ? (
                        filteredExamEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-md flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-primary">{format(new Date(event.date), 'dd')}</span>
                                    <span className="text-xs text-primary/80">{format(new Date(event.date), 'MMM')}</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-base">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{event.activity} - {event.batch}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{event.time}</p>
                                    <Badge variant="secondary" className="mt-1 capitalize">{event.type}</Badge>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No exams scheduled for the selected filters.</p>
                            <p className="text-sm">Please check back later for updates.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
