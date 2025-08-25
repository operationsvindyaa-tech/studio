
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { getEvents, type Event } from "@/lib/schedule-db";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isSameDay } from 'date-fns';

export default function UpcomingEventsPage() {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await getEvents();
            // Filter out exams
            setAllEvents(data.filter(event => event.type !== 'exam'));
            setLoading(false);
        }
        fetchEvents();
    }, []);

    const filteredEvents = selectedDate
        ? allEvents.filter(event => isSameDay(event.date, selectedDate)).sort((a,b) => a.date.getTime() - b.date.getTime())
        : allEvents.sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                    <CardContent className="p-2">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md w-full"
                            modifiers={{ scheduled: allEvents.map(e => e.date) }}
                            modifiersClassNames={{ scheduled: 'bg-primary/20 rounded-full' }}
                        />
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule for {selectedDate ? format(selectedDate, 'PPP') : 'All Events'}</CardTitle>
                        <CardDescription>Upcoming activities, holidays, and events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading ? (
                                Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <div key={event.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md flex flex-col items-center justify-center">
                                            <span className="text-sm font-bold">{format(event.date, 'dd')}</span>
                                            <span className="text-xs text-muted-foreground">{format(event.date, 'MMM')}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground">{event.time}</p>
                                            <Badge variant="outline" className="mt-1 capitalize">{event.type}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No events or activities scheduled for this day.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
