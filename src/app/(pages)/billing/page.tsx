
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Printer, GraduationCap, Download, Edit, Trash2, PlusCircle, Phone, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getStudents, type Student } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { getBillingData, StudentBillingInfo, Activity, courseFees, calculateTotal, activityHeads } from "@/lib/billing-db";


const formatAmount = (amount: number) => {
    return amount.toFixed(2);
};

type BillingStatus = "Paid" | "Due" | "Overdue";

type NewInvoice = {
    studentId: string;
    activities: Activity[];
    months: string;
    discount: number;
    tax: number;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<StudentBillingInfo[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<StudentBillingInfo | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<StudentBillingInfo | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<StudentBillingInfo | null>(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<NewInvoice>({ studentId: '', activities: [{ name: 'Tuition Fee', fee: 2500, description: '' }], months: '', discount: 0, tax: 0 });
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const students = await getStudents();
            setAllStudents(students);
            const billingRecords = await getBillingData();
            setBillingData(billingRecords);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load student data for billing.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [toast]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });
  
  const handleViewInvoice = (invoice: StudentBillingInfo) => {
    setSelectedInvoice(invoice);
    setIsInvoiceOpen(true);
  };
  
  const handleEditInvoice = (invoice: StudentBillingInfo) => {
    setEditingInvoice({ ...invoice, activities: [...invoice.activities] });
    setIsEditOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (editingInvoice) {
        setBillingData(prevData =>
            prevData.map(item => (item.id === editingInvoice.id ? editingInvoice : item))
        );
        setIsEditOpen(false);
        setEditingInvoice(null);
        toast({
            title: "Success",
            description: "Invoice details have been updated successfully."
        });
    }
  };

  const handleActivityChange = (index: number, field: keyof Activity, value: string | number) => {
    if (editingInvoice) {
      const updatedActivities = [...editingInvoice.activities];
      const activity = updatedActivities[index];
      
      if(field === 'name') {
          const selectedHead = activityHeads.find(h => h.name === value);
          activity.name = value as string;
          if(selectedHead) activity.fee = selectedHead.fee;
      } else {
          (activity[field as 'description' | 'fee'] as any) = value;
      }

      setEditingInvoice({ ...editingInvoice, activities: updatedActivities });
    }
  };

  const handleAddActivity = () => {
    if (editingInvoice) {
        setEditingInvoice({
            ...editingInvoice,
            activities: [...editingInvoice.activities, { name: '', description: '', fee: 0 }],
        });
    }
  };

  const handleRemoveActivity = (index: number) => {
    if (editingInvoice) {
        const updatedActivities = editingInvoice.activities.filter((_, i) => i !== index);
        setEditingInvoice({ ...editingInvoice, activities: updatedActivities });
    }
  };

  const handleDeleteInvoice = (invoice: StudentBillingInfo) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
        setBillingData(prevData => prevData.filter(item => item.id !== invoiceToDelete.id));
        toast({
            title: "Invoice Deleted",
            description: `Invoice for ${invoiceToDelete.name} has been successfully deleted.`
        });
    }
    setIsDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

    const handleStatusChange = (invoiceId: string, newStatus: BillingStatus) => {
        setBillingData(prevData =>
            prevData.map(invoice =>
                invoice.id === invoiceId
                    ? { ...invoice, status: newStatus, paymentDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined }
                    : invoice
            )
        );
        const studentName = billingData.find(inv => inv.id === invoiceId)?.name;
        toast({
            title: "Status Updated",
            description: `Invoice for ${studentName} has been marked as ${newStatus}.`
        });
    };

  // Manual Invoice Creation handlers
  const handleCreateNewInvoice = () => {
      const { studentId, activities, months, discount, tax } = newInvoice;
      if (!studentId || activities.length === 0 || !months) {
          toast({ title: "Error", description: "Please fill all fields for the new invoice.", variant: "destructive" });
          return;
      }

      const student = allStudents.find(s => s.id === studentId);
      if (!student) {
          toast({ title: "Error", description: "Selected student not found.", variant: "destructive" });
          return;
      }
      
      const processedActivities = activities.map(act => {
        let description = act.description || act.name;
        const courseName = student.desiredCourse?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "";
        
        let finalDescription = act.name;
        if (act.name === "Tuition Fee" && courseName) {
            finalDescription += ` for ${courseName}`;
        }
        finalDescription += ` for month(s): ${months}`;

        return {
            ...act,
            description: finalDescription,
        };
      });

      const newBillingRecord: StudentBillingInfo = {
          id: `B${String(billingData.length + 1).padStart(4, '0')}`,
          studentId,
          name: student.name,
          whatsappNumber: student.whatsappNumber,
          activities: processedActivities,
          discount,
          tax,
          status: "Due",
          dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], // Due in 15 days
          months: months.split(',').map(m => m.trim()),
      };
      
      setBillingData(prev => [newBillingRecord, ...prev]);
      toast({ title: "Success", description: `Invoice created for ${student.name}.` });
      setIsCreateInvoiceOpen(false);
      setNewInvoice({ studentId: '', activities: [{ name: 'Tuition Fee', fee: 2500, description: '' }], months: '', discount: 0, tax: 0 });
  };
  
  const handleNewInvoiceActivityChange = (index: number, field: keyof Activity, value: string | number) => {
      const updatedActivities = [...newInvoice.activities];
      const activity = updatedActivities[index];
      
      if (field === 'name') {
          const selectedHead = activityHeads.find(h => h.name === value);
          activity.name = value as string;
          if (selectedHead) {
              activity.fee = selectedHead.fee;
          }
      } else {
          (activity[field as 'description' | 'fee'] as any) = value;
      }
      
      setNewInvoice(prev => ({ ...prev, activities: updatedActivities }));
  };

  const handleAddNewInvoiceActivity = () => {
      setNewInvoice(prev => ({
          ...prev,
          activities: [...prev.activities, { name: 'Tuition Fee', fee: 2500, description: '' }],
      }));
  };
  
  const handleRemoveNewInvoiceActivity = (index: number) => {
      setNewInvoice(prev => ({
          ...prev,
          activities: prev.activities.filter((_, i) => i !== index),
      }));
  };
  
  const handleCourseSelect = (courseKey: string) => {
    if (!courseKey) return;
    const fee = courseFees[courseKey];
    const name = courseKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    setNewInvoice(prev => {
        const student = allStudents.find(s => s.id === prev.studentId);
        const courseName = student?.desiredCourse?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || name;
        
        const description = `Tuition Fee for ${courseName}`;

        if (prev.activities.some(act => act.description === description && newInvoice.months)) {
            toast({ title: "Course already added", description: `${name} is already in the activities list for these months.`, variant: "default" });
            return prev;
        }
        
        const initialActivities = prev.activities.length === 1 && prev.activities[0].name === 'Tuition Fee' && prev.activities[0].description === ''
            ? []
            : prev.activities;

        return {
            ...prev,
            activities: [...initialActivities, { name: "Tuition Fee", fee: fee || 0, description: description }],
        };
    });
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Billing</CardTitle>
              <CardDescription>
                Manage student fee payments and generate invoices for activities.
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateInvoiceOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    billingData.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-medium">{invoice.name}</div>
                          <div className="text-sm text-muted-foreground">Invoice #{invoice.id}</div>
                        </TableCell>
                        <TableCell>
                            {[...invoice.activities.map(a => a.name), invoice.admissionFee ? 'Admission Fee' : null].filter(Boolean).join(', ')}
                        </TableCell>
                        <TableCell className="text-right">{formatAmount(calculateTotal(invoice))}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === "Paid" ? "secondary" : invoice.status === "Due" ? "outline" : "destructive"
                            }
                            className={
                              invoice.status === "Paid" ? "bg-green-100 text-green-800" : invoice.status === "Due" ? "bg-orange-100 text-orange-800" : ""
                            }
                          >
                            {invoice.status}
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
                              <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                <FileText className="mr-2 h-4 w-4" /> View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Invoice
                              </DropdownMenuItem>
                               <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Change Status</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Paid')} disabled={invoice.status === 'Paid'}>
                                    Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Due')} disabled={invoice.status === 'Due'}>
                                    Due
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'Overdue')} disabled={invoice.status === 'Overdue'}>
                                    Overdue
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{billingData.length}</strong> records.
            </div>
        </CardFooter>
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-2xl">
          <div ref={invoiceRef} className="p-6">
            <DialogHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold font-headline">VINDYAA - The Altitude of Art</h1>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">#19, 1st Cross, 1st Main, Sri Manjunatha Layout, <br/> Basavanapura Main Rd, Near SBI Bank, Bengaluru, Karnataka 560049<br/>Phone: +91 95909 59005 | Email: vindyaa.art@gmail.com</p>
                    </div>
                    <div className="text-right">
                        <DialogTitle className="text-2xl font-bold">INVOICE</DialogTitle>
                        <p className="text-sm text-muted-foreground">Invoice #{selectedInvoice?.id}</p>
                    </div>
                </div>
            </DialogHeader>
            {selectedInvoice && (
              <div className="mt-8 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground font-semibold">Bill To:</p>
                    <p>{selectedInvoice.name}</p>
                    <p>Student ID: {selectedInvoice.studentId}</p>
                    {selectedInvoice.whatsappNumber && (
                        <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedInvoice.whatsappNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p><span className="text-muted-foreground font-semibold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground font-semibold">Due Date:</span> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.activities.map((activity, index) => (
                         <TableRow key={`activity-${index}`}>
                            <TableCell>
                                <p className="font-medium">{activity.name}</p>
                                <p className="text-muted-foreground">{activity.description}</p>
                            </TableCell>
                            <TableCell className="text-right">{formatAmount(activity.fee)}</TableCell>
                        </TableRow>
                    ))}
                    {selectedInvoice.admissionFee && (
                         <TableRow>
                            <TableCell>
                                <p className="font-medium">One-time Admission Fee</p>
                            </TableCell>
                            <TableCell className="text-right">{formatAmount(selectedInvoice.admissionFee)}</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatAmount(selectedInvoice.activities.reduce((s, a) => s + a.fee, 0) + (selectedInvoice.admissionFee || 0))}</span>
                    </div>
                    {selectedInvoice.discount && (
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>- {formatAmount(selectedInvoice.discount)}</span>
                        </div>
                    )}
                    {selectedInvoice.tax && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ({selectedInvoice.tax}%)</span>
                        <span>
                            {
                                (() => {
                                    const subtotal = selectedInvoice.activities.reduce((s, a) => s + a.fee, 0) + (selectedInvoice.admissionFee || 0);
                                    const subtotalAfterDiscount = subtotal - (selectedInvoice.discount || 0);
                                    const taxAmount = subtotalAfterDiscount * (selectedInvoice.tax! / 100);
                                    return `+ ${formatAmount(taxAmount)}`;
                                })()
                            }
                        </span>
                      </div>
                    )}
                    <Separator/>
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>{formatAmount(calculateTotal(selectedInvoice))}</span>
                    </div>
                  </div>
                </div>
                 <div className="mt-8">
                    <p className="font-semibold">Notes</p>
                    <p className="text-xs text-muted-foreground">Please make the payment before the due date to avoid late fees. Thank you for your prompt payment.</p>
                </div>
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    This is a computer-generated invoice and does not require a signature.
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 sm:justify-end p-6 pt-0">
            <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Close</Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       {/* Edit Invoice Dialog */}
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Correct the details for invoice #{editingInvoice?.id}.
            </DialogDescription>
          </DialogHeader>
          {editingInvoice && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input id="studentName" value={editingInvoice.name} onChange={(e) => setEditingInvoice({...editingInvoice, name: e.target.value })}/>
                </div>

                <Separator />
                
                <div className="space-y-2">
                    <Label>Activities</Label>
                    {editingInvoice.activities.map((activity, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                                <Select value={activity.name} onValueChange={(value) => handleActivityChange(index, 'name', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select Head" /></SelectTrigger>
                                    <SelectContent>
                                        {activityHeads.map(head => <SelectItem key={head.name} value={head.name}>{head.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input placeholder="Description (optional)" value={activity.description || ''} onChange={(e) => handleActivityChange(index, 'description', e.target.value)} className="col-span-4" />
                            <Input type="number" placeholder="Fee" value={activity.fee} onChange={(e) => handleActivityChange(index, 'fee', Number(e.target.value))} className="col-span-2" />
                            <Button variant="outline" size="icon" onClick={() => handleRemoveActivity(index)} className="col-span-1"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddActivity}><PlusCircle className="mr-2 h-4 w-4" />Add Activity</Button>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount (INR)</Label>
                        <Input id="discount" type="number" value={editingInvoice.discount || 0} onChange={(e) => setEditingInvoice({ ...editingInvoice, discount: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tax">Tax (%)</Label>
                        <Input id="tax" type="number" value={editingInvoice.tax || 0} onChange={(e) => setEditingInvoice({ ...editingInvoice, tax: Number(e.target.value) })} />
                    </div>
                </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manual Invoice Creation Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>Create Manual Invoice</DialogTitle>
                  <DialogDescription>
                      Generate a new invoice for a student with specific activities.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-2">
                      <Label htmlFor="student-select">Student</Label>
                      <Select value={newInvoice.studentId} onValueChange={(value) => setNewInvoice(prev => ({ ...prev, studentId: value }))}>
                          <SelectTrigger id="student-select"><SelectValue placeholder="Select a student" /></SelectTrigger>
                          <SelectContent>
                              {allStudents.map(student => <SelectItem key={student.id} value={student.id}>{student.name} ({student.id})</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="invoice-months">Month(s)</Label>
                      <Input id="invoice-months" placeholder="e.g., September, October" value={newInvoice.months} onChange={(e) => setNewInvoice(prev => ({ ...prev, months: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="course-select">Select Course to Add</Label>
                      <Select onValueChange={handleCourseSelect}>
                        <SelectTrigger id="course-select"><SelectValue placeholder="Select a course" /></SelectTrigger>
                        <SelectContent>
                            {Object.entries(courseFees).map(([key, fee]) => (
                                <SelectItem key={key} value={key}>
                                    {key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                  </div>

                  <Separator />
                  <div className="space-y-2">
                      <Label>Activities</Label>
                      {newInvoice.activities.map((activity, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-5">
                                  <Label className="sr-only">Activity Head</Label>
                                  <Select value={activity.name} onValueChange={(value) => handleNewInvoiceActivityChange(index, 'name', value)}>
                                      <SelectTrigger><SelectValue placeholder="Select Head" /></SelectTrigger>
                                      <SelectContent>
                                          {activityHeads.map(head => <SelectItem key={head.name} value={head.name}>{head.name}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="col-span-4">
                                  <Label className="sr-only">Description</Label>
                                  <Input placeholder="Description (auto-filled)" value={activity.description || ''} onChange={(e) => handleNewInvoiceActivityChange(index, 'description', e.target.value)} />
                              </div>
                              <div className="col-span-2">
                                  <Label className="sr-only">Fee</Label>
                                  <Input type="number" placeholder="Fee" value={activity.fee} onChange={(e) => handleNewInvoiceActivityChange(index, 'fee', Number(e.target.value))} />
                              </div>
                              <Button variant="outline" size="icon" onClick={() => handleRemoveNewInvoiceActivity(index)} className="col-span-1"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={handleAddNewInvoiceActivity}><PlusCircle className="mr-2 h-4 w-4" />Add Custom Activity</Button>
                  </div>

                   <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-invoice-discount">Discount (INR)</Label>
                        <Input id="new-invoice-discount" type="number" placeholder="e.g., 100" value={newInvoice.discount} onChange={(e) => setNewInvoice(prev => ({ ...prev, discount: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-invoice-tax">Tax (%)</Label>
                        <Input id="new-invoice-tax" type="number" placeholder="e.g., 18" value={newInvoice.tax} onChange={(e) => setNewInvoice(prev => ({ ...prev, tax: Number(e.target.value) }))} />
                    </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleCreateNewInvoice}>Create Invoice</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the invoice for {invoiceToDelete?.name}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setInvoiceToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    
