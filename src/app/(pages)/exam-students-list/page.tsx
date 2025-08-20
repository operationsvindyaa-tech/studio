
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getExamRecords, addExamRecord, updateExamRecord, deleteExamRecord, type ExamRecord } from "@/lib/exam-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getStudents } from "@/lib/db";
import { getCourses } from "@/lib/courses-db";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export default function ExamStudentsListPage() {
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExamRecord | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<ExamRecord, 'id'>> & { date?: Date }>({});
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordData, studentData, courseData] = await Promise.all([
        getExamRecords(),
        getStudents(),
        getCourses(),
      ]);
      setRecords(recordData);
      setStudents(studentData.map(s => ({ id: s.id, name: s.name })));
      setCourses(courseData.map(c => c.title));
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleOpenDialog = (record: ExamRecord | null) => {
    setEditingRecord(record);
    setFormData(record ? { ...record, examDate: new Date(record.examDate), feePaymentDate: record.feePaymentDate ? new Date(record.feePaymentDate) : undefined } : { examDate: new Date(), paymentStatus: "Pending" });
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFormSubmit = async () => {
    const { studentName, activity, examType, universityName, feesAmount, feePaymentDate, paymentStatus, examDate } = formData;
    if (!studentName || !activity || !examType || !feesAmount || !examDate) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    const recordData = { 
        ...formData, 
        examDate: (examDate as Date).toISOString(),
        feePaymentDate: feePaymentDate ? (feePaymentDate as Date).toISOString() : undefined,
        feesAmount: Number(feesAmount),
     } as Omit<ExamRecord, 'id'>;

    if (editingRecord) {
        await updateExamRecord(editingRecord.id, recordData);
        toast({ title: "Success", description: "Record updated successfully." });
    } else {
        await addExamRecord(recordData);
        toast({ title: "Success", description: "New exam record added." });
    }
    fetchData();
    handleCloseDialog();
  };
  
  const handleDelete = async (recordId: string) => {
      await deleteExamRecord(recordId);
      toast({ title: "Deleted", description: "The exam record has been removed." });
      fetchData();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Exam Students List & Tracker</CardTitle>
              <CardDescription>
                Manage student examination details and payment status.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Exam Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                ) : records.length > 0 ? (
                  records.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.activity}</TableCell>
                      <TableCell>{record.examType}</TableCell>
                      <TableCell>{record.universityName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.feesAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={record.paymentStatus === 'Paid' ? 'secondary' : (record.paymentStatus === 'Pending' ? 'outline' : 'destructive')}>
                          {record.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(record.examDate), "dd MMM, yyyy")}</TableCell>
                      <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDialog(record)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(record.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">No exam records found.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{records.length}</strong> records.
            </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Exam Record</DialogTitle>
            <DialogDescription>
              {editingRecord ? 'Update the details for this exam record.' : 'Fill in the details for a new exam record.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Select value={formData.studentName} onValueChange={(value) => handleFormChange('studentName', value)}>
                        <SelectTrigger id="student-name"><SelectValue placeholder="Select a student" /></SelectTrigger>
                        <SelectContent>
                            {students.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activity">Activity</Label>
                    <Select value={formData.activity} onValueChange={(value) => handleFormChange('activity', value)}>
                        <SelectTrigger id="activity"><SelectValue placeholder="Select an activity" /></SelectTrigger>
                        <SelectContent>
                            {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="exam-type">Exam Type</Label>
                    <Input id="exam-type" value={formData.examType || ''} onChange={(e) => handleFormChange('examType', e.target.value)} placeholder="e.g., Annual, Grading" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="university-name">University Name</Label>
                    <Input id="university-name" value={formData.universityName || ''} onChange={(e) => handleFormChange('universityName', e.target.value)} placeholder="e.g., Gandharva Mahavidyalaya" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="fees-amount">Fees Amount</Label>
                    <Input id="fees-amount" type="number" value={formData.feesAmount || ''} onChange={(e) => handleFormChange('feesAmount', e.target.value)} placeholder="e.g., 1500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => handleFormChange('paymentStatus', value)}>
                        <SelectTrigger id="payment-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Waived">Waived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="payment-date">Fee Payment Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.feePaymentDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.feePaymentDate ? format(formData.feePaymentDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.feePaymentDate as Date} onSelect={(date) => date && handleFormChange('feePaymentDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="exam-date">Date of Exam</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !formData.examDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.examDate ? format(formData.examDate as Date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.examDate as Date} onSelect={(date) => date && handleFormChange('examDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFormSubmit}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
