
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Ruler, Plus, X, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStudents, type Student } from "@/lib/db";
import { getKmdRecords, addKmdRecord, updateKmdRecord, deleteKmdRecord, type KmdRecord } from "@/lib/kmd-db";
import { Skeleton } from "@/components/ui/skeleton";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

const courses = [
  "Bharatanatyam", "Vocal Carnatic", "Guitar", "Keyboard", "Piano", "Drums",
  "Violin", "Western Dance", "Zumba", "Gymnastics", "Yoga", "Karate",
  "Kalaripayattu", "Art & Craft"
];

export default function KmdPage() {
  const [allRecords, setAllRecords] = useState<KmdRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<KmdRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KmdRecord | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<KmdRecord, 'id'>>>({});
  const [activityFilter, setActivityFilter] = useState<string>("All Activities");
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordData, studentData] = await Promise.all([
        getKmdRecords(),
        getStudents(),
      ]);
      setAllRecords(recordData);
      setFilteredRecords(recordData);
      setStudents(studentData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load measurement data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    if (activityFilter === "All Activities") {
        setFilteredRecords(allRecords);
    } else {
        setFilteredRecords(allRecords.filter(record => record.activityName === activityFilter));
    }
  }, [activityFilter, allRecords]);

  const handleOpenDialog = (record: KmdRecord | null) => {
    setEditingRecord(record);
    setFormData(record ? { ...record, measurements: record.measurements ? [...record.measurements] : [] } : { activityName: courses[0], measurements: [{ name: "Chest", value: "" }] });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof Omit<KmdRecord, 'measurements'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
        setFormData(prev => ({
            ...prev,
            studentId,
            studentName: student.name,
            phone: student.whatsappNumber || '',
        }));
    }
  }

  const handleMeasurementChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => {
        const newMeasurements = [...(prev.measurements || [])];
        newMeasurements[index] = { ...newMeasurements[index], [field]: value };
        return { ...prev, measurements: newMeasurements };
    });
  };

  const handleAddMeasurement = () => {
      setFormData(prev => ({
          ...prev,
          measurements: [...(prev.measurements || []), { name: "", value: "" }],
      }));
  };

  const handleRemoveMeasurement = (index: number) => {
      setFormData(prev => ({
          ...prev,
          measurements: (prev.measurements || []).filter((_, i) => i !== index),
      }));
  };

  const handleFormSubmit = async () => {
    if (!formData.studentId || !formData.activityName) {
      toast({ title: "Error", description: "Please select a student and activity.", variant: "destructive" });
      return;
    }

    const finalFormData = {
        ...formData,
        measurements: formData.measurements?.filter(m => m.name.trim() !== "" && m.value.trim() !== "")
    };


    if (editingRecord) {
      await updateKmdRecord(editingRecord.id, finalFormData as KmdRecord);
      toast({ title: "Success", description: "Measurement record updated." });
    } else {
      await addKmdRecord(finalFormData as Omit<KmdRecord, 'id'>);
      toast({ title: "Success", description: "New measurement record added." });
    }
    fetchData();
    handleCloseDialog();
  };

  const handleDelete = async (recordId: string) => {
    await deleteKmdRecord(recordId);
    toast({ title: "Deleted", description: "The measurement record has been removed." });
    fetchData();
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `KMD_Report_${activityFilter.replace(' ','_')}`,
  });
  
  const handleExport = () => {
    if (filteredRecords.length === 0) {
        toast({ title: "No data to export.", variant: "destructive" });
        return;
    }
    const worksheetData = filteredRecords.map(record => ({
        'Student Name': record.studentName,
        'Phone': record.phone,
        'Activity': record.activityName,
        'Measurements': (record.measurements || []).map(m => `${m.name}: ${m.value}`).join(' | '),
        'Notes': record.notes || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KMD Records');
    XLSX.writeFile(workbook, `KMD_Report_${activityFilter.replace(' ','_')}.xlsx`);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>KMD - Kids Measurement Details</CardTitle>
              <CardDescription>
                Track student measurements for costumes, gejje, and other items.
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by activity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Activities">All Activities</SelectItem>
                        {courses.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
                <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                <Button onClick={() => handleOpenDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Measurement
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg" ref={printRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Measurements</TableHead>
                  <TableHead className="print:hidden">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="print:hidden"><Skeleton className="h-8 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.studentName}</div>
                        <div className="text-sm text-muted-foreground">{record.phone}</div>
                      </TableCell>
                      <TableCell>{record.activityName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {(record.measurements || []).map((m, i) => (
                                <span key={i} className="text-xs">
                                    <strong className="text-muted-foreground">{m.name}:</strong> {m.value}
                                </span>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="print:hidden">
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenDialog(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No measurement records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredRecords.length}</strong> records.
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Measurement Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Student</Label>
                <Select value={formData.studentId} onValueChange={handleStudentSelect}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-select">Activity</Label>
                <Select value={formData.activityName} onValueChange={(value) => handleFormChange('activityName', value)}>
                  <SelectTrigger id="activity-select">
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Ruler /> Measurements</h3>
                <div className="space-y-2">
                    {(formData.measurements || []).map((measurement, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input 
                                value={measurement.name} 
                                onChange={(e) => handleMeasurementChange(index, 'name', e.target.value)} 
                                placeholder="e.g., Chest"
                                className="w-1/3"
                            />
                            <Input 
                                value={measurement.value} 
                                onChange={(e) => handleMeasurementChange(index, 'value', e.target.value)} 
                                placeholder="e.g., 28 inches"
                                className="flex-grow"
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveMeasurement(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddMeasurement}>
                        <Plus className="mr-2 h-4 w-4" /> Add Measurement
                    </Button>
                </div>
            </div>
            <div className="space-y-2 pt-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={formData.notes || ''} onChange={(e) => handleFormChange('notes', e.target.value)} placeholder="Any additional notes or measurements..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleFormSubmit}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
