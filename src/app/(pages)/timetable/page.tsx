
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const centers = [
  "Main Campus (Basavanapura)",
  "Branch 2 (Marathahalli)",
  "Branch 3 (Koramangala)",
  "Branch 4 (Indiranagar)",
  "Branch 5 (Jayanagar)",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8; // Start from 8 AM
  const minute = (i % 2) * 30;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
});

const courses = [
  "Bharatanatyam", "Vocal Carnatic", "Guitar", "Keyboard", "Piano", "Drums",
  "Violin", "Western Dance", "Zumba", "Gymnastics", "Yoga", "Karate",
  "Kalaripayattu", "Art & Craft"
];

type ScheduleEntry = {
  course: string;
  time: string;
};

type TimetableData = {
  [center: string]: {
    [day: string]: {
      [time: string]: ScheduleEntry;
    };
  };
};

const initialTimetableData: TimetableData = {};
centers.forEach(center => {
    initialTimetableData[center] = {};
    daysOfWeek.forEach(day => {
        initialTimetableData[center][day] = {};
    });
});


export default function TimetablePage() {
  const [selectedCenter, setSelectedCenter] = useState(centers[0]);
  const [timetableData, setTimetableData] = useState<TimetableData>(initialTimetableData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { toast } = useToast();

  const handleSlotClick = (day: string, time: string) => {
    const existingEntry = timetableData[selectedCenter]?.[day]?.[time];
    if (existingEntry) {
        setSelectedCourse(existingEntry.course);
    } else {
        setSelectedCourse("");
    }
    setSelectedSlot({ day, time });
    setIsDialogOpen(true);
  };
  
  const handleSaveChanges = () => {
    if (selectedSlot && selectedCourse) {
        const { day, time } = selectedSlot;
        const newData = { ...timetableData };
        if (!newData[selectedCenter]) newData[selectedCenter] = {};
        if (!newData[selectedCenter][day]) newData[selectedCenter][day] = {};
        
        newData[selectedCenter][day][time] = { course: selectedCourse, time };
        
        setTimetableData(newData);
        toast({ title: "Success", description: `Scheduled ${selectedCourse} on ${day} at ${time}.` });
    }
    setIsDialogOpen(false);
    setSelectedSlot(null);
    setSelectedCourse("");
  };

  const handleClearSlot = () => {
    if (selectedSlot) {
        const { day, time } = selectedSlot;
        const newData = { ...timetableData };
        if (newData[selectedCenter]?.[day]?.[time]) {
            delete newData[selectedCenter][day][time];
            setTimetableData(newData);
            toast({ title: "Slot Cleared", description: `The schedule for ${day} at ${time} has been cleared.` });
        }
    }
    setIsDialogOpen(false);
    setSelectedSlot(null);
    setSelectedCourse("");
  }


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>School Time Table</CardTitle>
              <CardDescription>
                Manage class schedules for different branches. Click a slot to add or edit.
              </CardDescription>
            </div>
            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a center" />
              </SelectTrigger>
              <SelectContent>
                {centers.map((center) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[800px]">
              {/* Header Row */}
              <div className="sticky top-0 z-10 bg-muted p-2 font-semibold text-center rounded-tl-lg">Time</div>
              {daysOfWeek.map((day) => (
                <div key={day} className="sticky top-0 z-10 bg-muted p-2 font-semibold text-center border-l">
                  {day}
                </div>
              ))}

              {/* Timetable Body */}
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="contents">
                  <div className="p-2 border-t font-mono text-xs text-muted-foreground text-center">
                    {time}
                  </div>
                  {daysOfWeek.map((day) => {
                    const entry = timetableData[selectedCenter]?.[day]?.[time];
                    return (
                      <div
                        key={`${day}-${time}`}
                        className="p-1 border-t border-l flex items-center justify-center h-16 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSlotClick(day, time)}
                      >
                        {entry ? (
                          <div className="bg-primary/20 text-primary-foreground text-xs font-semibold p-2 rounded-md w-full h-full flex items-center justify-center text-center">
                            {entry.course}
                          </div>
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground opacity-50" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Edit Schedule</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedSlot?.day}, {selectedSlot?.time} at {selectedCenter}
                  </p>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="course-select">Course</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger id="course-select">
                            <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map(course => (
                                <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
              </div>
              <DialogFooter className="justify-between">
                <Button variant="destructive" onClick={handleClearSlot} disabled={!timetableData[selectedCenter]?.[selectedSlot?.day || '']?.[selectedSlot?.time || '']}>
                  <X className="mr-2 h-4 w-4" /> Clear Slot
                </Button>
                <div>
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-2">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
