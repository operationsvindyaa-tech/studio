
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const initialCenters = [
  "Main Campus (Basavanapura)",
  "Branch 2 (Marathahalli)",
  "Branch 3 (Koramangala)",
  "Branch 4 (Indiranagar)",
  "Branch 5 (Jayanagar)",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = Array.from({ length: 18 }, (_, i) => { // 5 AM to 10 PM (17 hours + 1 last slot)
  const hour = i + 5;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(displayHour).padStart(2, '0')}:00 ${period}`;
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

const initializeTimetableData = (centers: string[]): TimetableData => {
    const data: TimetableData = {};
    centers.forEach(center => {
        data[center] = {};
        daysOfWeek.forEach(day => {
            data[center][day] = {};
        });
    });
    return data;
};


export default function TimetablePage() {
  const [centers, setCenters] = useState(initialCenters);
  const [selectedCenter, setSelectedCenter] = useState(centers[0]);
  const [timetableData, setTimetableData] = useState<TimetableData>(() => initializeTimetableData(centers));
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [isCenterDialogOpen, setIsCenterDialogOpen] = useState(false);
  const [tempCenters, setTempCenters] = useState<string[]>([]);
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
    setIsSlotDialogOpen(true);
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
    setIsSlotDialogOpen(false);
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
    setIsSlotDialogOpen(false);
    setSelectedSlot(null);
    setSelectedCourse("");
  };

  const handleOpenCenterDialog = () => {
    setTempCenters([...centers]);
    setIsCenterDialogOpen(true);
  };

  const handleTempCenterChange = (index: number, value: string) => {
    const updated = [...tempCenters];
    updated[index] = value;
    setTempCenters(updated);
  };

  const handleAddCenter = () => {
    setTempCenters([...tempCenters, `New Branch ${tempCenters.length + 1}`]);
  };

  const handleRemoveCenter = (index: number) => {
    setTempCenters(tempCenters.filter((_, i) => i !== index));
  };

  const handleSaveCenters = () => {
    const oldCenterData = { ...timetableData };
    const newTimetableData = initializeTimetableData(tempCenters);

    // Preserve existing data for renamed centers
    tempCenters.forEach((newCenterName, index) => {
        const oldCenterName = centers[index];
        if (oldCenterData[oldCenterName]) {
            newTimetableData[newCenterName] = oldCenterData[oldCenterName];
        }
    });
    
    setCenters(tempCenters);
    setTimetableData(newTimetableData);

    // If selected center was removed or renamed, update selection
    if (!tempCenters.includes(selectedCenter)) {
        setSelectedCenter(tempCenters[0] || "");
    }
    
    setIsCenterDialogOpen(false);
    toast({ title: "Success", description: "Branch list updated successfully." });
  };


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
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={selectedCenter} onValueChange={setSelectedCenter} disabled={centers.length === 0}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select a center" />
                </SelectTrigger>
                <SelectContent>
                    {centers.map((center) => (
                    <SelectItem key={center} value={center}>{center}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <Button variant="outline" size="icon" onClick={handleOpenCenterDialog}>
                    <Edit className="h-4 w-4" />
                </Button>
            </div>
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
              {timeSlots.map((time) => (
                <div key={time} className="contents">
                  <div className="p-2 border-t font-mono text-xs text-muted-foreground text-center flex items-center justify-center">
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
      
      {/* Slot Edit Dialog */}
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
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

      {/* Center Edit Dialog */}
      <Dialog open={isCenterDialogOpen} onOpenChange={setIsCenterDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Branches</DialogTitle>
                <DialogDescription>
                    Rename, add, or remove your school branches here.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                {tempCenters.map((center, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={center} onChange={(e) => handleTempCenterChange(index, e.target.value)} />
                        <Button variant="outline" size="icon" onClick={() => handleRemoveCenter(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddCenter}>
                    <Plus className="mr-2 h-4 w-4" /> Add Branch
                </Button>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveCenters}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
