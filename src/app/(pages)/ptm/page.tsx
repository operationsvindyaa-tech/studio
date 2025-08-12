
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getStudents, type Student } from "@/lib/db";
import { getTeachers, type Teacher } from "@/lib/teachers-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type PTM = {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  activityName: string;
  date: Date;
  comments: string;
  feedback: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

const courses = [
  "Bharatanatyam", "Vocal Carnatic", "Guitar", "Keyboard", "Piano", "Drums",
  "Violin", "Western Dance", "Zumba", "Gymnastics", "Yoga", "Karate",
  "Kalaripayattu", "Art & Craft"
];

const initialPtmData: PTM[] = [
    { id: "PTM001", studentId: "S001", studentName: "Amelia Rodriguez", teacherId: "T001", teacherName: "Dr. Evelyn Reed", activityName: "Bharatanatyam", date: new Date("2024-09-15T10:00:00"), comments: "Discuss progress and upcoming performance.", feedback: "Amelia is showing great potential. Needs to focus on her posture.", status: "Completed" },
    { id: "PTM002", studentId: "S002", studentName: "Benjamin Carter", teacherId: "T002", teacherName: "Prof. Samuel Jones", activityName: "Vocal Carnatic", date: new Date("2024-09-20T14:30:00"), comments: "Review of last quarter's performance.", feedback: "Benjamin has a strong voice but needs practice on pitch control.", status: "Scheduled" },
];

export default function PtmPage() {
  const [ptms, setPtms] = useState<PTM[]>(initialPtmData);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPtm, setEditingPtm] = useState<PTM | null>(null);
  const [formData, setFormData] = useState<Partial<PTM>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentData, teacherData] = await Promise.all([getStudents(), getTeachers()]);
        setStudents(studentData);
        setTeachers(teacherData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load necessary data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleOpenDialog = (ptm: PTM | null) => {
    setEditingPtm(ptm);
    setFormData(ptm || { date: new Date(), status: "Scheduled" });
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPtm(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof PTM, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: keyof PTM, id: string, nameSelector: (item: any) => string, list: any[]) => {
    const selected = list.find(item => item.id === id);
    if (selected) {
        setFormData(prev => ({
            ...prev,
            [field]: id,
            [`${field.replace('Id', '')}Name`]: nameSelector(selected)
        }));
    }
  };

  const handleFormSubmit = () => {
    if (!formData.studentId || !formData.teacherId || !formData.activityName || !formData.date) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    if (editingPtm) {
        setPtms(ptms.map(p => p.id === editingPtm.id ? { ...p, ...formData } as PTM : p));
        toast({ title: "Success", description: "PTM details updated successfully." });
    } else {
        const newPtm: PTM = {
            id: `PTM${String(ptms.length + 1).padStart(3, '0')}`,
            ...formData
        } as PTM;
        setPtms([...ptms, newPtm]);
        toast({ title: "Success", description: "New PTM scheduled successfully." });
    }
    handleCloseDialog();
  };
  
  const handleDelete = (ptmId: string) => {
      setPtms(ptms.filter(p => p.id !== ptmId));
      toast({ title: "Deleted", description: "The PTM record has been removed." });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Parent-Teacher Meetings</CardTitle>
              <CardDescription>
                Schedule, view, and manage all parent-teacher meetings.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule PTM
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : ptms.length > 0 ? (
                  ptms.map(ptm => (
                    <TableRow key={ptm.id}>
                      <TableCell>{ptm.studentName}</TableCell>
                      <TableCell>{ptm.teacherName}</TableCell>
                      <TableCell>{ptm.activityName}</TableCell>
                      <TableCell>{format(ptm.date, "PPP p")}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ptm.status === 'Completed' ? 'secondary' : ptm.status === 'Cancelled' ? 'destructive' : 'default'
                        }>
                          {ptm.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDialog(ptm)}>
                                <Eye className="mr-2 h-4 w-4" /> View/Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(ptm.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No PTMs scheduled yet.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{ptms.length}</strong> PTM records.
            </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPtm ? 'Edit' : 'Schedule'} PTM</DialogTitle>
            <DialogDescription>
              {editingPtm ? 'Update the details for this meeting.' : 'Fill in the details to schedule a new meeting.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
                <Label htmlFor="student-select">Student</Label>
                 <Select value={formData.studentId} onValueChange={(value) => handleSelectChange('studentId', value, (s: Student) => s.name, students)}>
                    <SelectTrigger id="student-select"><SelectValue placeholder="Select a student" /></SelectTrigger>
                    <SelectContent>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="teacher-select">Teacher</Label>
                 <Select value={formData.teacherId} onValueChange={(value) => handleSelectChange('teacherId', value, (t: Teacher) => t.name, teachers)}>
                    <SelectTrigger id="teacher-select"><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                    <SelectContent>
                        {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="activity-select">Activity/Course</Label>
                 <Select value={formData.activityName} onValueChange={(value) => handleFormChange('activityName', value)}>
                    <SelectTrigger id="activity-select"><SelectValue placeholder="Select an activity" /></SelectTrigger>
                    <SelectContent>
                        {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="ptm-date">Date and Time</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP p") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={formData.date} onSelect={(date) => date && handleFormChange('date', date)} initialFocus />
                       <div className="p-3 border-t border-border">
                            <Input type="time" defaultValue={formData.date ? format(formData.date, 'HH:mm') : ''} onChange={(e) => {
                                const newDate = formData.date ? new Date(formData.date) : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                handleFormChange('date', newDate);
                            }} />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="comments">Comments / Agenda</Label>
                <Textarea id="comments" value={formData.comments} onChange={(e) => handleFormChange('comments', e.target.value)} placeholder="e.g., Discuss quarterly progress, upcoming exams..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Details</Label>
                <Textarea id="feedback" value={formData.feedback} onChange={(e) => handleFormChange('feedback', e.target.value)} placeholder="e.g., Strengths, areas for improvement..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status-select">Status</Label>
                 <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                    <SelectTrigger id="status-select"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
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
    </>
  );
}
