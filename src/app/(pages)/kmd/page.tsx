
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStudents, type Student } from "@/lib/db";
import { getKmdRecords, addKmdRecord, updateKmdRecord, deleteKmdRecord, type KmdRecord } from "@/lib/kmd-db";
import { Skeleton } from "@/components/ui/skeleton";

const courses = [
  "Bharatanatyam", "Vocal Carnatic", "Guitar", "Keyboard", "Piano", "Drums",
  "Violin", "Western Dance", "Zumba", "Gymnastics", "Yoga", "Karate",
  "Kalaripayattu", "Art & Craft"
];

export default function KmdPage() {
  const [records, setRecords] = useState<KmdRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KmdRecord | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<KmdRecord, 'id'>>>({});
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordData, studentData] = await Promise.all([
        getKmdRecords(),
        getStudents(),
      ]);
      setRecords(recordData);
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

  const handleOpenDialog = (record: KmdRecord | null) => {
    setEditingRecord(record);
    setFormData(record ? { ...record } : { activityName: courses[0] });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleFormChange = (field: keyof KmdRecord, value: any) => {
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

  const handleFormSubmit = async () => {
    if (!formData.studentId || !formData.activityName) {
      toast({ title: "Error", description: "Please select a student and activity.", variant: "destructive" });
      return;
    }

    if (editingRecord) {
      await updateKmdRecord(editingRecord.id, formData as KmdRecord);
      toast({ title: "Success", description: "Measurement record updated." });
    } else {
      await addKmdRecord(formData as Omit<KmdRecord, 'id'>);
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>KMD - Kids Measurement Details</CardTitle>
              <CardDescription>
                Track student measurements for costumes, gejje, and other items.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Measurement
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
                  <TableHead>Chest</TableHead>
                  <TableHead>Waist</TableHead>
                  <TableHead>Hips</TableHead>
                  <TableHead>Gejje</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : records.length > 0 ? (
                  records.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.studentName}</div>
                        <div className="text-sm text-muted-foreground">{record.phone}</div>
                      </TableCell>
                      <TableCell>{record.activityName}</TableCell>
                      <TableCell>{record.chest || 'N/A'}</TableCell>
                      <TableCell>{record.waist || 'N/A'}</TableCell>
                      <TableCell>{record.hips || 'N/A'}</TableCell>
                      <TableCell>{record.gejjeSize || 'N/A'}</TableCell>
                      <TableCell>
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
                    <TableCell colSpan={7} className="h-24 text-center">
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
            Showing <strong>{records.length}</strong> records.
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
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="chest">Chest</Label>
                        <Input id="chest" value={formData.chest || ''} onChange={(e) => handleFormChange('chest', e.target.value)} placeholder="e.g., 28" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="waist">Waist</Label>
                        <Input id="waist" value={formData.waist || ''} onChange={(e) => handleFormChange('waist', e.target.value)} placeholder="e.g., 26" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hips">Hips</Label>
                        <Input id="hips" value={formData.hips || ''} onChange={(e) => handleFormChange('hips', e.target.value)} placeholder="e.g., 30" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sleeveLength">Sleeve Length</Label>
                        <Input id="sleeveLength" value={formData.sleeveLength || ''} onChange={(e) => handleFormChange('sleeveLength', e.target.value)} placeholder="e.g., 15" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="topLength">Top Length</Label>
                        <Input id="topLength" value={formData.topLength || ''} onChange={(e) => handleFormChange('topLength', e.target.value)} placeholder="e.g., 22" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bottomLength">Bottom Length</Label>
                        <Input id="bottomLength" value={formData.bottomLength || ''} onChange={(e) => handleFormChange('bottomLength', e.target.value)} placeholder="e.g., 34" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gejjeSize">Gejje Size</Label>
                        <Input id="gejjeSize" value={formData.gejjeSize || ''} onChange={(e) => handleFormChange('gejjeSize', e.target.value)} placeholder="e.g., 5 inches" />
                    </div>
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
