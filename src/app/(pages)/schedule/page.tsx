
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";

type Event = {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "meeting" | "exam" | "event" | "lecture" | "other";
};

const initialEvents: Event[] = [
  { id: "1", title: "Parent-Teacher Meetings", date: new Date("2024-08-15"), time: "9:00 AM - 4:00 PM", type: "meeting" },
  { id: "2", title: "Mid-term Exams Start", date: new Date("2024-08-19"), time: "All Day", type: "exam" },
  { id: "3", title: "Science Fair", date: new Date("2024-08-22"), time: "10:00 AM - 2:00 PM", type: "event" },
  { id: "4", title: "Guest Lecture: AI in Education", date: new Date("2024-08-25"), time: "3:00 PM", type: "lecture" },
];


export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<Event, 'id'>>>({});
  const { toast } = useToast();

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleOpenDialog = (event: Event | null) => {
    setEditingEvent(event);
    setFormData(event || { date: selectedDate || new Date(), time: '10:00 AM', type: 'event' });
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

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...formData } as Event : e));
      toast({ title: "Success", description: "Event updated successfully." });
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...formData,
      } as Event;
      setEvents([...events, newEvent]);
      toast({ title: "Success", description: "New event added successfully." });
    }
    handleCloseDialog();
  };
  
  const handleDeleteClick = (event: Event) => {
      setEventToDelete(event);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
        setEvents(events.filter(e => e.id !== eventToDelete.id));
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
                {(selectedDate ? filteredEvents : upcomingEvents).length > 0 ? (
                  (selectedDate ? filteredEvents : upcomingEvents).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-md flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">{format(event.date, 'dd')}</span>
                        <span className="text-xs text-primary-foreground/80">{format(event.date, 'MMM')}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{event.type}</Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                    <Input id="event-time" value={formData.time || ''} onChange={(e) => handleFormChange('time', e.target.value)} placeholder="e.g., 10:00 AM" />
                </div>
            </div>
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
}
