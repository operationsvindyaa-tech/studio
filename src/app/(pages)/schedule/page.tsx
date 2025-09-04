
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";
import { getEvents, updateEvents, type Event } from "@/lib/schedule-db";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`;
});

const activities = [
  "General", "All Courses", "Bharatanatyam", "Vocal Carnatic", "Guitar", "Keyboard", "Piano", "Drums",
  "Violin", "Western Dance", "Zumba", "Gymnastics", "Yoga", "Karate",
  "Kalaripayattu", "Art & Craft"
];


export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<Event, 'id'>>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
    }
    fetchEvents();
  }, [])

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleOpenDialog = (event: Event | null) => {
    setEditingEvent(event);
    setFormData(event || { date: selectedDate || new Date(), time: '10:00 AM', type: 'event', activity: 'General' });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.type) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map(e => e.id === editingEvent.id ? { ...e, ...formData } as Event : e)
      toast({ title: "Success", description: "Event updated successfully." });
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...formData,
      } as Event;
      updatedEvents = [...events, newEvent];
      toast({ title: "Success", description: "New event added successfully." });
    }
    setEvents(updatedEvents);
    updateEvents(updatedEvents);
    handleCloseDialog();
  };
  
  const handleDeleteClick = (event: Event) => {
      setEventToDelete(event);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
        const updatedEvents = events.filter(e => e.id !== eventToDelete.id)
        setEvents(updatedEvents);
        updateEvents(updatedEvents);
        toast({ title: "Event Deleted", description: `"${eventToDelete.title}" has been removed.` });
        setEventToDelete(null);
    }
  };

  const filteredEvents = selectedDate
    ? events.filter(event => isSameDay(event.date, selectedDate)).sort((a,b) => a.date.getTime() - b.date.getTime())
    : events.sort((a,b) => a.date.getTime() - b.date.getTime());
    
  const upcomingEvents = events.filter(e => e.date >= new Date()).sort((a,b) => a.date.getTime() - b.date.getTime());


  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDayClick}
                className="rounded-md w-full"
                modifiers={{ scheduled: events.map(e => e.date) }}
                modifiersClassNames={{ scheduled: 'bg-primary/20 rounded-full' }}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>{selectedDate ? `Events for ${format(selectedDate, 'PPP')}` : "What's happening on campus."}</CardDescription>
                </div>
                <Button size="sm" onClick={() => handleOpenDialog(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                    Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : (selectedDate ? filteredEvents : upcomingEvents).length > 0 ? (
                  (selectedDate ? filteredEvents : upcomingEvents).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 group border p-3 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md flex flex-col items-center justify-center">
                        <span className="text-sm font-bold">{format(event.date, 'dd')}</span>
                        <span className="text-xs text-muted-foreground">{format(event.date, 'MMM')}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{event.type}</Badge>
                            {event.activity && <Badge variant="secondary">{event.activity}</Badge>}
                        </div>
                        {event.posterUrl && (
                            <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden">
                                <Image src={event.posterUrl} alt={event.title} layout="fill" objectFit="cover" data-ai-hint="event poster" />
                            </div>
                        )}
                         {event.videoUrl && (
                            <Button variant="link" asChild className="p-0 h-auto mt-2">
                                <a href={event.videoUrl} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-4 w-4 mr-2" /> Watch Video
                                </a>
                            </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenDialog(event)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(event)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No events scheduled {selectedDate ? 'for this day' : 'coming up'}.</p>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input id="event-title" value={formData.title || ''} onChange={(e) => handleFormChange('title', e.target.value)} placeholder="e.g., Annual Sports Day" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" value={formData.date ? format(formData.date, 'yyyy-MM-dd') : ''} onChange={(e) => handleFormChange('date', new Date(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Select value={formData.time} onValueChange={(value) => handleFormChange('time', value)}>
                        <SelectTrigger id="event-time">
                            <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Day">All Day</SelectItem>
                            {timeSlots.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleFormChange('type', value)}>
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity</Label>
                <Select value={formData.activity} onValueChange={(value) => handleFormChange('activity', value)}>
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map(activity => (
                        <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="poster-url">Poster Image URL (Optional)</Label>
              <Input id="poster-url" value={formData.posterUrl || ''} onChange={(e) => handleFormChange('posterUrl', e.target.value)} placeholder="https://example.com/image.png" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="video-url">Video URL (Optional)</Label>
              <Input id="video-url" value={formData.videoUrl || ''} onChange={(e) => handleFormChange('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFormSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event "{eventToDelete?.title}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
