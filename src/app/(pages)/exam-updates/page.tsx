
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEvents, type Event } from "@/lib/schedule-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ListOrdered } from "lucide-react";

export default function ExamUpdatesPage() {
    const [examEvents, setExamEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await getEvents();
            // Filter for exams and sort by date
            setExamEvents(
                data
                    .filter(event => event.type === 'exam')
                    .sort((a,b) => a.date.getTime() - b.date.getTime())
            );
            setLoading(false);
        }
        fetchEvents();
    }, []);

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <ListOrdered className="h-6 w-6" />
                    <div>
                        <CardTitle>Exam Updates</CardTitle>
                        <CardDescription>Schedule for all upcoming examinations.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                    ) : examEvents.length > 0 ? (
                        examEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-md flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-primary">{format(event.date, 'dd')}</span>
                                    <span className="text-xs text-primary/80">{format(event.date, 'MMM')}</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-base">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">{format(event.date, 'EEEE, MMMM do yyyy')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{event.time}</p>
                                    <Badge variant="secondary" className="mt-1 capitalize">{event.type}</Badge>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No exams scheduled at the moment.</p>
                            <p className="text-sm">Please check back later for updates.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
